# AI 写作助手

一个基于 Next.js 构建的 AI 写作助手，帮助用户组织写作风格提示词，并发送给大型语言模型（LLM）生成内容。该工具旨在帮助作家、内容创作者和文案专业人员通过AI技术提升写作效率和质量。

<!-- 
在发布前，请将实际应用截图替换到 public/screenshot.png 文件，并取消下面这行注释
![AI写作助手截图](./public/screenshot.png) 
-->

## 🌟 功能特点

- **丰富的写作风格定制**：详细的提示词风格编辑器，包括语言、结构、叙述、情感、思维等多个维度
- **多模型支持**：兼容多种大型语言模型API，包括OpenAI、Anthropic Claude、Google Gemini、Groq、Ollama和Grok
- **API设置灵活性**：可折叠的API设置面板，便于配置不同的API端点和密钥
- **用户友好界面**：使用Tailwind CSS打造的现代化UI，具有响应式设计
- **内容实时编辑**：生成内容后可以直接在编辑器中修改
- **导出功能**：将生成的内容导出为Markdown格式
- **详细调试信息**：提供API响应的详细信息，便于排查问题
- **深色/浅色模式**：支持系统主题切换

## 🚀 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- React
- Modern API Integration

## 🛠️ 快速开始

确保你已安装 Node.js 16.20.0 或更高版本。

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

然后在浏览器中访问 [http://localhost:3000](http://localhost:3000)。

### 预览
![preview](./preview/preview.jpg)

## 📝 使用方法

1. **API 设置**：
   - 点击"API设置"展开面板
   - 选择你想使用的API提供商（OpenAI、Anthropic、Google Gemini、Groq、Ollama或Grok）
   - 输入相应的API密钥
   - 可选：配置自定义的API基础URL（用于代理或本地模型）
   - 选择合适的模型

2. **内容设置**：
   - 设置文章主题
   - 添加关键词（用"、"分隔）
   - 设定目标字数
   - 点击"风格编辑器"自定义详细的提示词风格

3. **提示词风格定制**：
   - 基本风格：设置整体风格概述
   - 语言风格：调整句型模式、用词选择、修辞手法等
   - 结构：定义段落长度、过渡风格、层次模式
   - 叙述：选择视角、时间顺序、叙述态度
   - 情感：设置情感强度、表达方式、情感基调
   - 思维：调整逻辑模式、思考深度、思考节奏
   - 独特性：添加标志性短语、意象系统
   - 文化：引入典故、知识领域
   - 节奏：设置音节模式、停顿模式、节奏

4. **生成内容**：
   - 点击"生成内容"按钮
   - 等待AI处理请求（加载指示器显示进度）

5. **编辑与导出**：
   - 在右侧编辑器中查看生成的内容
   - 根据需要编辑内容
   - 点击"导出为Markdown"保存文件

## 🔌 支持的 LLM API

本应用支持多种主流大型语言模型的API：

- **OpenAI**：GPT-4、GPT-3.5-Turbo等模型
- **Anthropic Claude**：Claude 3 Opus、Sonnet、Haiku等系列模型
- **Google Gemini**：Gemini Pro、Ultra等系列
- **Groq**：提供高速推理的LLM API服务
- **Ollama**：本地运行的开源模型
- **Grok**：xAI开发的Grok系列模型

对于API连接问题，应用还提供了专门的Grok API测试页面，可以访问`/grok`路径进行API连接测试和排查。

## 🌐 API代理支持

如果您遇到CORS限制或网络访问问题，本应用内置了代理支持：

1. 在API设置中勾选"使用代理服务器"选项
2. 应用将通过内部代理端点转发请求，避开浏览器的CORS限制

## 🤝 贡献指南

欢迎对本项目进行贡献！以下是参与方式：

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 贡献者

<a href="https://github.com/GeekyWizKid/writing-helper/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=GeekyWizKid/writing-helper" />
</a>

## 📋 待办事项

- [ ] 添加更多LLM模型支持
- [ ] 实现内容历史记录功能
- [ ] 添加用户账户系统
- [ ] 支持协作写作
- [ ] 提供风格模板库

## ⚠️ 免责声明

本项目仅供学习和研究使用，使用本项目时请注意：

1. **内容责任**：使用本项目生成的内容由使用者自行负责，项目开发者不对生成内容的准确性、合法性、道德性等承担责任。

2. **API使用**：使用本项目需要自行配置和承担相关API的费用，项目开发者不对API服务的中断、错误或费用承担责任。

3. **合规性**：使用者应确保使用本项目符合当地法律法规，包括但不限于：
   - 数据保护法规
   - 内容审核要求
   - 知识产权法规
   - 隐私保护规定

4. **使用限制**：禁止将本项目用于：
   - 生成虚假或误导性信息
   - 侵犯他人知识产权
   - 违反法律法规的内容
   - 任何可能造成危害的用途

5. **服务保证**：本项目按"现状"提供，不提供任何明示或暗示的保证，包括但不限于：
   - 功能的完整性
   - 服务的可用性
   - 内容的准确性
   - 系统的安全性

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

完整许可证文本请查看 [LICENSE](./LICENSE) 文件。

## 📧 联系方式

如有问题或建议，请通过GitHub Issues联系我们。 