# AI API 配置说明

## 支持的 API 提供商

本项目通过 **OpenRouter** 中转调用 Gemini 模型，同时支持豆包作为备选：

| 提供商 | 模型 | 适用场景 |
|--------|------|----------|
| 豆包 (Doubao) | doubao-seed-1-6-lite | 大陆服务器部署 |
| **OpenRouter** | **google/gemini-2.5-flash-lite**（识图） | **推荐：全球可访问** |
| **OpenRouter** | **google/gemini-2.5-flash-image**（抠图） | **推荐：全球可访问** |

## 环境变量设置

### 本地开发

1. 复制 `.env.local.example` 为 `.env.local`
2. 根据使用的 API 配置对应的 Key

### Vercel 部署（推荐使用 OpenRouter）

在 Vercel 项目设置中添加环境变量：

1. 进入项目 Settings → Environment Variables
2. 添加变量：
   - Name: `OPENROUTER_API_KEY`
   - Value: 你的 OpenRouter API Key
3. 选择环境：Production, Preview, Development
4. 保存后重新部署

## API 切换

所有标志位统一在 `src/config/flags.ts` 中管理：

```typescript
// 识图API模式：0=豆包, 1=Gemini（通过OpenRouter中转）
export const RECOGNIZE_API_FLAG: number = 1;  // 推荐使用 Gemini

// 抠图模式：0=Gemini(OpenRouter), 1=PHOTOROOM, 2=不抠图
export const REMOVE_BG_FLAG: number = 0;  // 推荐使用 Gemini
```

## 注意事项

- `.env.local` 文件已在 `.gitignore` 中，不会被提交到 Git
- 请勿在代码中硬编码 API Key
- **所有 Gemini 调用都通过 OpenRouter 中转**，全球可访问
- 识图使用 `google/gemini-2.5-flash-lite`
- 抠图使用 `google/gemini-2.5-flash-image`
