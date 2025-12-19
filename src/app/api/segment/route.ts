import { NextRequest, NextResponse } from 'next/server';

// PhotoRoom 抠图 API
const PHOTOROOM_API_URL = 'https://sdk.photoroom.com/v1/segment';

interface SegmentRequest {
  imageBase64: string;
  objectName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SegmentRequest = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: '缺少图片数据' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PHOTOROOM_API_KEY;

    if (!apiKey) {
      // 开发模式：返回原图
      console.log('开发模式：使用模拟抠图');
      return NextResponse.json({
        success: true,
        segmentedImage: imageBase64,
        isSimulated: true,
      });
    }

    try {
      // 移除 base64 前缀
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      
      // 将 base64 转换为 Buffer
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      // 创建 FormData
      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
      formData.append('image_file', blob, 'image.jpg');

      // 设置30秒超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(PHOTOROOM_API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const resultBuffer = await response.arrayBuffer();
        const resultBase64 = Buffer.from(resultBuffer).toString('base64');
        console.log('✅ 抠图成功！');
        
        return NextResponse.json({
          success: true,
          segmentedImage: `data:image/png;base64,${resultBase64}`,
          isSimulated: false,
        });
      } else {
        const errorText = await response.text();
        console.error('❌ 抠图API调用失败:', errorText);
        console.error('⚠️ 使用原图代替抠图结果');
        // 失败时返回原图
        return NextResponse.json({
          success: true,
          segmentedImage: imageBase64,
          isSimulated: true,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('CONNECT_TIMEOUT') || errorMessage.includes('fetch failed')) {
        console.error('❌ 抠图API连接超时！无法访问 sdk.photoroom.com');
        console.error('⚠️ 请检查网络连接或使用代理（科学上网）');
      } else {
        console.error('❌ 抠图API错误:', errorMessage);
      }
      console.error('⚠️ 使用原图代替抠图结果');
      // 失败时返回原图
      return NextResponse.json({
        success: true,
        segmentedImage: imageBase64,
        isSimulated: true,
      });
    }

  } catch (error) {
    console.error('抠图错误:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '抠图失败',
        segmentedImage: null,
      },
      { status: 500 }
    );
  }
}
