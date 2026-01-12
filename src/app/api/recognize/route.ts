import { NextRequest, NextResponse } from 'next/server';
import { RECOGNIZE_API_FLAG } from '@/config/flags';

// 豆包视觉模型 API 配置 - Doubao-Seed-1.6-lite
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
// 推理接入点
const DOUBAO_ENDPOINT_ID = 'ep-20251105144941-hxmgb';
// 模型名称
const DOUBAO_MODEL_NAME = 'doubao-seed-1-6-lite-251015';

// OpenRouter API 配置（用于中转调用 Gemini）
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemini-2.5-flash-lite';

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

    // 获取豆包 API Key（优先使用环境变量，否则使用硬编码的key）
    const apiKey = process.env.DOUBAO_API_KEY || 'f1df8cb2-c16c-4b6b-a673-c919175a10fb';
    const modelId = process.env.DOUBAO_MODEL_ID || DOUBAO_MODEL_NAME;

    // 根据开关选择 API：0=豆包，1=Gemini(OpenRouter中转)
    if (RECOGNIZE_API_FLAG === 1) {
      // 使用 Gemini API（通过 OpenRouter 中转）
      console.log('🤖 Gemini AI识别中（OpenRouter中转）...');
      const result = await callOpenRouterAPI(imageBase64, targetWord, targetWordCn);
      return NextResponse.json(result);
    }

    // 使用豆包 API
    console.log('🤖 豆包AI识别中...');

    if (!apiKey) {
      // 开发模式：模拟 AI 响应
      console.log('开发模式：使用模拟 AI 响应');
      const mockResult = getMockResult(targetWord);
      return NextResponse.json(mockResult);
    }

    // 精简的 Prompt
    const systemPrompt = `识别图片中的物体，判断是否是"${targetWord}"(${targetWordCn})。宽松判断：同类物品都算匹配。
返回JSON: {"is_match":bool,"detected_object_en":"str","detected_object_cn":"str","feedback":"str"}
feedback: 匹配时留空，不匹配时用可爱语气说看到什么(10字内)。`;

    // 移除 base64 前缀
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // 调用豆包 API - 使用 Doubao-Seed-1.6-lite 模型
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        max_completion_tokens: 1000,
        reasoning_effort: 'low',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`,
                },
              },
              {
                type: 'text',
                text: systemPrompt,
              },
            ],
          },
        ],
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

// OpenRouter API 调用函数
async function callOpenRouterAPI(imageBase64: string, targetWord: string, targetWordCn: string): Promise<AIRecognitionResult> {
  const startTime = Date.now();
  
  // 获取 OpenRouter API Key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY 未配置，请在环境变量中设置');
  }
  
  // 移除 base64 前缀
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  
  // 精简的 Prompt
  const prompt = `识别图片中的物体，判断是否是"${targetWord}"(${targetWordCn})。宽松判断：同类物品都算匹配。
返回JSON: {"is_match":bool,"detected_object_en":"str","detected_object_cn":"str","feedback":"str"}
feedback: 匹配时留空，不匹配时用可爱语气说看到什么(10字内)。`;

  // 调用 OpenRouter API
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://wordhunter.app',
      'X-Title': 'WordHunter Game',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
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
      temperature: 0.1,
    }),
  });

  const elapsed = Date.now() - startTime;
  console.log(`⏱️ OpenRouter API 响应时间: ${elapsed}ms`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter API 错误:', errorText);
    throw new Error(`OpenRouter API 调用失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenRouter API 返回内容为空');
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
      console.error('OpenRouter 原始响应:', content);
      throw new Error('无法解析 OpenRouter AI 响应');
    }
  }

  return result;
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
