import { NextRequest, NextResponse } from 'next/server';

// 处理 OPTIONS 请求，支持 CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// 处理 POST 请求，获取 Ollama 模型列表
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { ollamaUrl } = body;

    // 验证 URL 格式
    if (!ollamaUrl || !ollamaUrl.startsWith('http')) {
      return NextResponse.json(
        { error: '无效的 Ollama URL 格式' },
        { status: 400 }
      );
    }

    // 设置超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // 请求 Ollama API
      console.log(`[Proxy] 请求 Ollama API: ${ollamaUrl}`);
      const response = await fetch(ollamaUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      // 清除超时
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[Proxy] Ollama 服务返回错误: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { error: `Ollama 服务返回错误: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      // 解析 Ollama 服务返回的数据
      const data = await response.json();
      console.log(`[Proxy] Ollama 返回数据:`, data);
      
      // 处理返回的数据格式
      // 新版 Ollama API 返回的是对象数组: { models: [{ name: "model1", ... }, { name: "model2", ... }] }
      if (data.models && Array.isArray(data.models)) {
        // 如果是对象数组，提取 name 属性作为模型名称
        if (typeof data.models[0] === 'object') {
          interface OllamaModel {
            name?: string;
            model?: string;
            [key: string]: unknown;
          }
          
          const modelNames = data.models.map((model: OllamaModel) => model.name || model.model || '').filter(Boolean);
          console.log(`[Proxy] 提取的模型名称:`, modelNames);
          return NextResponse.json({ models: modelNames });
        }
        // 如果已经是字符串数组，则直接返回
        console.log(`[Proxy] 返回模型数据:`, { models: data.models });
        return NextResponse.json(data);
      } else if (data.names && Array.isArray(data.names)) {
        // 如果返回的是 names 数组
        console.log(`[Proxy] 返回 names 数据:`, { models: data.names });
        return NextResponse.json({ models: data.names });
      } else {
        // 如果没有标准格式，尝试从返回数据中提取可能的模型信息
        console.log(`[Proxy] 无标准格式的模型数据，尝试提取:`, data);
        const possibleModels: string[] = [];
        
        // 尝试遍历对象找到可能的模型列表
        for (const key in data) {
          if (Array.isArray(data[key])) {
            interface PossibleModel {
              name?: string;
              model?: string;
              id?: string;
              [key: string]: unknown;
            }
            
            possibleModels.push(...data[key].map((item: unknown) => {
              if (typeof item === 'string') return item;
              if (typeof item === 'object' && item !== null) {
                const model = item as PossibleModel;
                return model.name || model.model || model.id || '';
              }
              return '';
            }).filter(Boolean));
          }
        }
        
        if (possibleModels.length > 0) {
          console.log(`[Proxy] 提取的可能模型:`, possibleModels);
          return NextResponse.json({ models: possibleModels });
        }
        
        // 如果无法提取任何模型信息，返回空数组
        return NextResponse.json({ models: [] });
      }
    } catch (error) {
      // 处理网络错误或超时
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      const status = error instanceof Error && error.name === 'AbortError' ? 504 : 500;
      
      console.error(`[Proxy] 请求 Ollama 服务失败: ${errorMessage}`);
      return NextResponse.json(
        { error: `请求 Ollama 服务失败: ${errorMessage}` },
        { status }
      );
    }
  } catch (error) {
    // 处理请求体解析错误
    console.error(`[Proxy] 请求格式错误: `, error);
    return NextResponse.json(
      { error: '请求格式错误' },
      { status: 400 }
    );
  }
} 