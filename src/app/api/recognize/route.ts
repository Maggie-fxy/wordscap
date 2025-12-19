import { NextRequest, NextResponse } from 'next/server';

// 豆包视觉模型 API 配置
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

interface RecognizeRequest {
  imageBase64: string;
  targetWord: string;
  targetWordCn: string;
}

interface AIRecognitionResult {
  is_match: boolean;
  detected_object_en: string;
  detected_object_cn: string;
  feedback: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RecognizeRequest = await request.json();
    const { imageBase64, targetWord, targetWordCn } = body;

    if (!imageBase64 || !targetWord) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取豆包 API Key 和模型
    const apiKey = process.env.DOUBAO_API_KEY;
    const modelId = process.env.DOUBAO_MODEL_ID || 'doubao-seed-1-6-flash-250828';

    if (!apiKey) {
      // 开发模式：模拟 AI 响应
      console.log('开发模式：使用模拟 AI 响应');
      const mockResult = getMockResult(targetWord);
      return NextResponse.json(mockResult);
    }

    // 构建 Prompt
    const systemPrompt = `你是一个儿童英语寻宝游戏的裁判。
1. 请识别图片中的核心物体。
2. 判断该物体是否属于单词: "${targetWord}" (${targetWordCn}) 的范畴。（例如 target 是 CUP，那么马克杯、玻璃杯、纸杯都算 true）。
3. 返回严格的 JSON 格式，不要 Markdown。

JSON 结构:
{
  "is_match": boolean,
  "detected_object_en": "string",
  "detected_object_cn": "string", 
  "feedback": "string"
}

注意：
- detected_object_en: 你看到的物体英文名
- detected_object_cn: 中文名
- feedback: 如果 is_match 为 false，用幽默语气告诉孩子你看到了什么(15字内)。如果 is_match 为 true，留空字符串。`;

    // 移除 base64 前缀
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // 调用豆包 API
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: systemPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('豆包 API 错误:', errorText);
      throw new Error(`API 调用失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('API 返回内容为空');
    }

    // 解析 JSON 响应
    let result: AIRecognitionResult;
    try {
      // 尝试直接解析
      result = JSON.parse(content);
    } catch {
      // 尝试从文本中提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析 AI 响应');
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('识别错误:', error);
    
    // 返回错误但允许用户强制通过
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '识别失败',
        allowForcePass: true,
      },
      { status: 500 }
    );
  }
}

// 开发模式模拟结果
function getMockResult(targetWord: string): AIRecognitionResult {
  // 随机决定是否匹配（70% 概率匹配）
  const isMatch = Math.random() > 0.3;
  
  if (isMatch) {
    return {
      is_match: true,
      detected_object_en: targetWord.toLowerCase(),
      detected_object_cn: '目标物体',
      feedback: '',
    };
  } else {
    const randomObjects = [
      { en: 'book', cn: '书' },
      { en: 'phone', cn: '手机' },
      { en: 'pen', cn: '笔' },
      { en: 'mouse', cn: '鼠标' },
      { en: 'cup', cn: '杯子' },
    ];
    const randomObj = randomObjects[Math.floor(Math.random() * randomObjects.length)];
    
    return {
      is_match: false,
      detected_object_en: randomObj.en,
      detected_object_cn: randomObj.cn,
      feedback: `这是${randomObj.cn}，不是我们要找的哦~`,
    };
  }
}
