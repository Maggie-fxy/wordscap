'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

// 扩展 MediaTrackCapabilities 类型以支持 zoom
interface ZoomCapabilities {
  zoom?: { min: number; max: number; step?: number };
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isStreaming: boolean;
  isFrontCamera: boolean;
  error: string | null;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  zoomSupported: boolean; // 是否真正支持硬件zoom
  setZoom: (zoom: number) => void;
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
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoomState] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(4); // 默认提供4x范围给UI显示
  const [zoomSupported, setZoomSupported] = useState(false); // 硬件是否真正支持
  const trackRef = useRef<MediaStreamTrack | null>(null);

  // 应用zoom到视频轨道 - 兼容Android WebView/华为浏览器
  const applyZoomToTrack = async (track: MediaStreamTrack, zoomValue: number): Promise<boolean> => {
    // 方法1: 使用 advanced constraints (标准方式)
    try {
      await track.applyConstraints({ advanced: [{ zoom: zoomValue } as MediaTrackConstraintSet] });
      return true;
    } catch (e1) {
      console.log('Advanced zoom failed, trying direct:', e1);
    }
    
    // 方法2: 直接设置zoom约束 (某些Android WebView)
    try {
      await track.applyConstraints({ zoom: zoomValue } as MediaTrackConstraints);
      return true;
    } catch (e2) {
      console.log('Direct zoom also failed:', e2);
    }
    
    return false;
  };

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
      
      // Bug 7: 检测设备方向，适配竖屏/横屏
      const isPortrait = window.innerHeight > window.innerWidth;
      
      // 请求相机权限，优先使用后置摄像头，根据屏幕方向调整分辨率
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 后置摄像头
          width: { ideal: isPortrait ? 720 : 1280 },
          height: { ideal: isPortrait ? 1280 : 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      
      // 获取视频轨道并检查缩放能力
      const videoTrack = stream.getVideoTracks()[0];
      trackRef.current = videoTrack;
      
      if (videoTrack) {
        // 检测zoom能力 - 兼容各种浏览器
        let hasZoomSupport = false;
        let detectedMin = 1;
        let detectedMax = 1;
        
        try {
          const capabilities = videoTrack.getCapabilities?.() as MediaTrackCapabilities & ZoomCapabilities;
          if (capabilities?.zoom && capabilities.zoom.max > capabilities.zoom.min) {
            detectedMin = capabilities.zoom.min || 1;
            detectedMax = capabilities.zoom.max || 1;
            hasZoomSupport = detectedMax > detectedMin;
          }
        } catch (e) {
          console.log('getCapabilities failed:', e);
        }
        
        // 设置zoom范围 - 即使不支持也提供UI范围
        if (hasZoomSupport) {
          setMinZoom(detectedMin);
          setMaxZoom(detectedMax);
          setZoomSupported(true);
        } else {
          // 不支持时提供默认范围给UI，但标记为不支持
          setMinZoom(1);
          setMaxZoom(4);
          setZoomSupported(false);
        }
        setZoomState(1); // 默认1x
        
        // 尝试应用初始zoom（仅当支持时）
        if (hasZoomSupport) {
          try {
            await applyZoomToTrack(videoTrack, detectedMin);
          } catch (e) {
            console.log('Initial zoom apply failed:', e);
          }
        }
      }

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

  // setZoom - 统一的缩放控制（滑杆和捏合共用）
  const setZoom = useCallback((newZoom: number) => {
    // 前置摄像头禁用zoom
    if (isFrontCamera) {
      return;
    }
    
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // 先更新UI状态（即使硬件不支持也更新，graceful fallback）
    setZoomState(clampedZoom);
    
    // 尝试应用硬件zoom
    if (trackRef.current && zoomSupported) {
      applyZoomToTrack(trackRef.current, clampedZoom).catch(() => {
        // 静默失败 - UI已更新
      });
    }
  }, [minZoom, maxZoom, isFrontCamera, zoomSupported]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    isFrontCamera,
    error,
    zoom,
    minZoom,
    maxZoom,
    zoomSupported,
    setZoom,
    startCamera,
    stopCamera,
    captureImage,
  };
}
