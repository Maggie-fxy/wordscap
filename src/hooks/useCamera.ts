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
  hardwareZoomAvailable: boolean; // 硬件zoom是否可用
  softwareZoomActive: boolean;    // 是否正在使用软件zoom
  setZoom: (zoom: number) => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => string | null;
}

// 软件zoom配置
const SOFTWARE_ZOOM_MIN = 1;
const SOFTWARE_ZOOM_MAX = 4;

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
  const [maxZoom, setMaxZoom] = useState(SOFTWARE_ZOOM_MAX);
  const [hardwareZoomAvailable, setHardwareZoomAvailable] = useState(false);
  const [softwareZoomActive, setSoftwareZoomActive] = useState(false);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const hardwareZoomTestedRef = useRef(false);
  const hardwareZoomWorksRef = useRef(false);

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
        
        // 设置zoom范围
        if (hasZoomSupport) {
          setMinZoom(detectedMin);
          setMaxZoom(Math.max(detectedMax, SOFTWARE_ZOOM_MAX));
          setHardwareZoomAvailable(true);
          setSoftwareZoomActive(false);
        } else {
          // 硬件不支持，使用软件zoom范围
          setMinZoom(SOFTWARE_ZOOM_MIN);
          setMaxZoom(SOFTWARE_ZOOM_MAX);
          setHardwareZoomAvailable(false);
          setSoftwareZoomActive(true);
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

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // 软件zoom：裁剪视频中心区域并放大
    if (softwareZoomActive && zoom > 1) {
      // 计算裁剪区域（ROI - Region of Interest）
      const cropWidth = videoWidth / zoom;
      const cropHeight = videoHeight / zoom;
      const cropX = (videoWidth - cropWidth) / 2;
      const cropY = (videoHeight - cropHeight) / 2;

      // 输出尺寸保持原视频尺寸（放大后的效果）
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // 从视频中心裁剪并放大绘制到canvas
      context.drawImage(
        video,
        cropX, cropY, cropWidth, cropHeight,  // 源区域（裁剪）
        0, 0, videoWidth, videoHeight          // 目标区域（全画布）
      );
    } else {
      // 硬件zoom或无缩放：直接绘制
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // 转换为 base64
    const imageData = canvas.toDataURL('image/jpeg', 0.85);
    
    return imageData;
  }, [isStreaming, softwareZoomActive, zoom]);

  // 组件卸载时停止相机
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // setZoom - 统一的缩放控制（滑杆和捏合共用）
  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // 更新UI状态
    setZoomState(clampedZoom);
    
    // 前置摄像头或硬件不可用时，使用软件zoom
    if (isFrontCamera || !hardwareZoomAvailable) {
      setSoftwareZoomActive(true);
      return;
    }
    
    // 尝试应用硬件zoom
    if (trackRef.current && hardwareZoomAvailable) {
      applyZoomToTrack(trackRef.current, clampedZoom).then(success => {
        if (!success) {
          // 硬件zoom失败，自动回退到软件zoom
          setSoftwareZoomActive(true);
        }
      }).catch(() => {
        setSoftwareZoomActive(true);
      });
    }
  }, [minZoom, maxZoom, isFrontCamera, hardwareZoomAvailable]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    isFrontCamera,
    error,
    zoom,
    minZoom,
    maxZoom,
    hardwareZoomAvailable,
    softwareZoomActive,
    setZoom,
    startCamera,
    stopCamera,
    captureImage,
  };
}
