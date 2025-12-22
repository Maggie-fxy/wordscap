/**
 * 图片压缩工具函数
 * 用于压缩base64图片以避免localStorage溢出
 */

/**
 * 压缩base64图片
 * @param base64 原始base64图片数据
 * @param maxWidth 最大宽度，默认400px
 * @param quality 压缩质量，默认0.6
 * @returns 压缩后的base64图片数据
 */
export async function compressImage(
  base64: string,
  maxWidth: number = 400,
  quality: number = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 如果不是base64图片，直接返回
    if (!base64.startsWith('data:image/')) {
      resolve(base64);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(base64);
          return;
        }

        // 计算缩放比例
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为压缩后的base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        console.log(`图片压缩: ${Math.round(base64.length / 1024)}KB -> ${Math.round(compressedBase64.length / 1024)}KB`);
        
        resolve(compressedBase64);
      } catch (error) {
        console.error('图片压缩失败:', error);
        resolve(base64); // 失败时返回原图
      }
    };

    img.onerror = () => {
      console.error('图片加载失败');
      resolve(base64); // 失败时返回原图
    };

    img.src = base64;
  });
}

/**
 * 检查localStorage剩余空间
 * @returns 剩余空间（字节）
 */
export function getLocalStorageSpace(): { used: number; total: number; remaining: number } {
  let total = 5 * 1024 * 1024; // 默认5MB
  let used = 0;

  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length * 2; // UTF-16编码，每个字符2字节
      }
    }
  } catch (e) {
    console.error('计算localStorage使用量失败:', e);
  }

  return {
    used,
    total,
    remaining: total - used,
  };
}

/**
 * 检查是否有足够的存储空间
 * @param dataSize 需要存储的数据大小（字节）
 * @returns 是否有足够空间
 */
export function hasEnoughStorage(dataSize: number): boolean {
  const { remaining } = getLocalStorageSpace();
  // 保留500KB的缓冲空间
  return remaining - 500 * 1024 > dataSize;
}
