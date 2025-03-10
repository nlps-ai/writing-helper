import { NextRequest, NextResponse } from 'next/server';

// 设置最大执行时间为 60 秒
export const maxDuration = 60;

// 添加 CORS 配置
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // 从请求体中获取目标 API 信息
    const { targetUrl, headers, body, isOllama } = await request.json();

    if (!targetUrl) {
      return NextResponse.json(
        { error: { message: '缺少目标 API URL' } },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    console.log('代理请求目标:', targetUrl);
    console.log('代理请求头:', JSON.stringify(headers).replace(/Bearer [^"]+/, 'Bearer [REDACTED]'));
    console.log('代理请求体:', JSON.stringify(body, null, 2));

    try {
      // 发起请求到目标 API，添加超时设置
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5分钟超时

      // 根据是否是 Ollama 请求调整请求体格式
      const requestBody = isOllama ? {
        model: body.model || 'llama2',
        prompt: Array.isArray(body.messages) ? body.messages[body.messages.length - 1].content : body.prompt,
        system: Array.isArray(body.messages) ? body.messages[0]?.content : undefined,
        format: 'json',
        stream: false
      } : body;

      // 确保使用正确的 URL - 对于 Ollama，必须是 /api/generate
      let requestUrl = targetUrl;
      if (isOllama && !targetUrl.includes('/api/generate')) {
        const baseUrl = targetUrl.includes('/api/') 
          ? targetUrl.substring(0, targetUrl.indexOf('/api/')) 
          : targetUrl;
        requestUrl = `${baseUrl}/api/generate`;
      }
      
      // 确保使用 IPv4 地址
      if (requestUrl.includes('localhost')) {
        requestUrl = requestUrl.replace('localhost', '127.0.0.1');
      }
      
      console.log('最终请求 URL:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isOllama ? {} : headers), // 非 Ollama 请求时添加原始请求头
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('代理请求响应错误:', response.status, errorText);
        throw new Error(`服务器返回错误：${response.status} ${errorText}`);
      }

      // 处理 Ollama 响应格式
      if (isOllama) {
        const ollamaResponse = await response.json();
        console.log('Ollama 原始响应:', JSON.stringify(ollamaResponse));
        
        // 提取实际文本内容 - Ollama可能返回JSON字符串作为响应
        let content = ollamaResponse.response || '无内容生成';
        
        // 尝试解析JSON响应中的内容
        try {
          // 检查是否是JSON字符串
          if (typeof content === 'string' && content.trim().startsWith('{')) {
            const parsedContent = JSON.parse(content);
            
            // 提取不同可能的内容结构
            if (parsedContent.article && parsedContent.article.content) {
              // 处理文章格式 {"article": {"title": "...", "content": ["...", "..."]}}
              if (Array.isArray(parsedContent.article.content)) {
                content = parsedContent.article.content.join('\n\n');
              } else {
                content = parsedContent.article.content.toString();
              }
            } else if (parsedContent.content) {
              // 处理直接内容格式 {"content": "..."}
              if (Array.isArray(parsedContent.content)) {
                content = parsedContent.content.join('\n\n');
              } else {
                content = parsedContent.content.toString();
              }
            } else if (parsedContent.text) {
              // 处理text格式 {"text": "..."}
              content = parsedContent.text.toString();
            } else if (parsedContent.title && typeof parsedContent.title === 'string') {
              // 只有标题的情况
              content = `# ${parsedContent.title}`;
              if (parsedContent.content) {
                content += `\n\n${Array.isArray(parsedContent.content) ? parsedContent.content.join('\n\n') : parsedContent.content.toString()}`;
              }
            }
          }

          // 去除内容中的Markdown标记，简化为纯文本
          content = content.replace(/[#*`_~]/g, '');
          
          // 确保content是字符串类型
          if (typeof content !== 'string') {
            content = String(content);
          }
        } catch (e) {
          console.log('解析Ollama响应内容失败，使用原始响应:', e);
          // 保持原始响应，但确保是字符串
          content = String(ollamaResponse.response || '无内容生成');
        }
        
        // 构造与 OpenAI 格式兼容的响应
        return NextResponse.json({
          id: 'ollama-' + Date.now(),
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: body.model || 'llama2',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: content // 确保是字符串
            },
            finish_reason: ollamaResponse.done_reason || 'stop'
          }],
          usage: {
            prompt_tokens: ollamaResponse.prompt_eval_count || 0,
            completion_tokens: ollamaResponse.eval_count || 0,
            total_tokens: (ollamaResponse.prompt_eval_count || 0) + (ollamaResponse.eval_count || 0)
          }
        });
      }

      // 非 Ollama 响应需要先解析然后重新包装
      const responseData = await response.json();
      return NextResponse.json(responseData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    } catch (fetchError) {
      console.error('代理请求失败:', fetchError);
      
      // 处理超时错误
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: { message: '请求超时，请稍后重试' } },
          { 
            status: 504,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );
      }

      // 处理连接错误
      if (fetchError instanceof Error && fetchError.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { error: { message: '无法连接到服务，请确保服务正在运行并且端口正确' } },
          { 
            status: 502,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );
      }

      // 处理其他错误
      return NextResponse.json(
        { 
          error: { 
            message: fetchError instanceof Error ? fetchError.message : '代理请求失败',
            stack: fetchError instanceof Error ? fetchError.stack : undefined,
            cause: fetchError instanceof Error ? String(fetchError.cause) : undefined
          } 
        },
        { 
          status: 502,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }
  } catch (error) {
    console.error('API 代理错误:', error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : '代理请求失败' } },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
} 