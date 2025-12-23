# AI 识别 API 配置说明

## 支持的 API 提供商

本项目支持三种 AI 图像识别 API：

| 提供商 | 优势 | 适用场景 |
|--------|------|----------|
| 豆包 (Doubao) | 大陆访问快 | 大陆服务器部署 |
| Gemini | 性能好 | 海外服务器（非香港） |
| **OpenRouter** | **全球可访问，性能极佳** | **推荐：香港/海外服务器** |

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

在 `src/app/api/recognize/route.ts` 中修改 `API_PROVIDER`：

```typescript
// 0 = 豆包API, 1 = Gemini API, 2 = OpenRouter API
const API_PROVIDER = 2;  // 推荐使用 OpenRouter
```

## 注意事项

- `.env.local` 文件已在 `.gitignore` 中，不会被提交到 Git
- 请勿在代码中硬编码 API Key
- OpenRouter 使用 `google/gemini-2.5-flash-lite` 模型，全球可访问
- Gemini API 在中国大陆和香港无法直接访问
