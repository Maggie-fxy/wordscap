'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isStreaming: boolean;
  isFrontCamera: boolean; // 是否是前置摄像头
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => string | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false); // 默认后置摄像头
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    // 防止重复启动
    if (isStartingRef.current || streamRef.current) {
      return;
    }
    
    isStartingRef.current = true;
    
    try {
      setError(null);
      
      // 检查是否支持 mediaDevices API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // 检查是否是不安全的上下文
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          setError('请使用 localhost:3000 访问以启用相机功能');
          isStartingRef.current = false;
          return;
        }
        setError('您的浏览器不支持相机功能');
        isStartingRef.current = false;
        return;
      }
      
      // 请求相机权限，优先使用后置摄像头
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 后置摄像头
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // 等待 video 元素准备好再播放
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current!;
          
          const onLoadedMetadata = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };
          
          const onError = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('视频加载失败'));
          };
          
          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);
          
          // 如果已经加载完成
          if (video.readyState >= 1) {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          }
        });
        
        await videoRef.current.play();
        setIsStreaming(true);
        setIsFrontCamera(false); // 后置摄像头成功启动
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('请允许访问相机权限');
        } else if (err.name === 'NotFoundError') {
          setError('未找到相机设备');
        } else if (err.name === 'NotReadableError') {
          setError('相机被其他应用占用');
        } else if (err.name === 'AbortError' || err.message.includes('interrupted')) {
          // play() 被中断，忽略这个错误，可能是组件重新渲染
          console.log('Camera play interrupted, will retry...');
        } else if (err.name === 'OverconstrainedError') {
          // 尝试使用前置摄像头
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            streamRef.current = fallbackStream;
            if (videoRef.current) {
              videoRef.current.srcObject = fallbackStream;
              await videoRef.current.play();
              setIsStreaming(true);
              setIsFrontCamera(true); // 回退到前置摄像头
            }
            isStartingRef.current = false;
            return;
          } catch {
            setError('无法访问相机');
          }
        } else {
          setError('相机启动失败: ' + err.message);
        }
      } else {
        setError('相机启动失败');
      }
    } finally {
      isStartingRef.current = false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // 设置 canvas 尺寸与视频一致
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 绘制当前帧
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 转换为 base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    return imageData;
  }, [isStreaming]);

  // 组件卸载时停止相机
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    isFrontCamera,
    error,
    startCamera,
    stopCamera,
    captureImage,
  };
}
