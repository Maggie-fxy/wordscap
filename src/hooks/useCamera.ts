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
  zoom: number;                   // UI zoom (0.5x ~ 3x)
  minZoom: number;                // UI最小值 (0.5)
  maxZoom: number;                // UI最大值 (3)
  hardwareZoomAvailable: boolean; // 硬件zoom是否可用
  softwareZoomActive: boolean;    // 是否正在使用软件zoom
  setZoom: (zoom: number) => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => string | null;
}

// UI zoom 配置：0.5x ~ 3x
const UI_ZOOM_MIN = 0.5;
const UI_ZOOM_MAX = 3;
// 硬件zoom只支持 >= 1
const HARDWARE_ZOOM_MIN = 1;

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoomState] = useState(1);           // UI zoom
  const [minZoom] = useState(UI_ZOOM_MIN);            // 固定0.5
  const [maxZoom, setMaxZoom] = useState(UI_ZOOM_MAX); // 固定3（或硬件更大时取更大值）
  const [hardwareZoomAvailable, setHardwareZoomAvailable] = useState(false);
  const [softwareZoomActive, setSoftwareZoomActive] = useState(false);
  const [hardwareZoomMax, setHardwareZoomMax] = useState(1); // 硬件zoom最大值
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
        
        // 设置zoom范围 - UI始终0.5x~3x，硬件zoom范围单独记录
        if (hasZoomSupport) {
          setHardwareZoomMax(detectedMax);
          setMaxZoom(Math.max(UI_ZOOM_MAX, detectedMax));
          setHardwareZoomAvailable(true);
          setSoftwareZoomActive(false);
        } else {
          // 硬件不支持
          setHardwareZoomMax(1);
          setMaxZoom(UI_ZOOM_MAX);
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

    // 软件zoom处理
    // zoom < 1：缩小（显示更大视野，但截图时裁剪中心）
    // zoom > 1：放大（裁剪中心区域）
    if (softwareZoomActive && zoom !== 1) {
      if (zoom < 1) {
        // zoom < 1：缩小效果
        // 截图时仍然输出原尺寸，但内容是缩小后的中心区域
        // 实际上是"看到更多"，截图时裁剪中心部分
        const scale = zoom; // 0.5 ~ 1
        const outputWidth = videoWidth * scale;
        const outputHeight = videoHeight * scale;
        const offsetX = (videoWidth - outputWidth) / 2;
        const offsetY = (videoHeight - outputHeight) / 2;

        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        // 先清空画布
        context.fillStyle = '#000';
        context.fillRect(0, 0, videoWidth, videoHeight);
        
        // 绘制缩小后的视频到中心
        context.drawImage(
          video,
          0, 0, videoWidth, videoHeight,           // 源：整个视频
          offsetX, offsetY, outputWidth, outputHeight  // 目标：缩小到中心
        );
      } else {
        // zoom > 1：放大效果（裁剪中心区域）
        const cropWidth = videoWidth / zoom;
        const cropHeight = videoHeight / zoom;
        const cropX = (videoWidth - cropWidth) / 2;
        const cropY = (videoHeight - cropHeight) / 2;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // 从视频中心裁剪并放大绘制到canvas
        context.drawImage(
          video,
          cropX, cropY, cropWidth, cropHeight,  // 源区域（裁剪）
          0, 0, videoWidth, videoHeight          // 目标区域（全画布）
        );
      }
    } else {
      // 硬件zoom或zoom=1：直接绘制
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
  // UI zoom: 0.5x ~ 3x
  // Hardware zoom: 只支持 >= 1x
  // 当 zoom < 1 时：纯软件缩放（缩小视野）
  // 当 zoom >= 1 时：优先硬件zoom，失败则软件zoom
  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // 更新UI状态
    setZoomState(clampedZoom);
    
    // 前置摄像头：始终使用软件zoom
    if (isFrontCamera) {
      setSoftwareZoomActive(true);
      return;
    }
    
    // zoom < 1：禁用硬件zoom，使用软件缩放
    if (clampedZoom < HARDWARE_ZOOM_MIN) {
      // 重置硬件zoom到1x
      if (trackRef.current && hardwareZoomAvailable) {
        applyZoomToTrack(trackRef.current, HARDWARE_ZOOM_MIN).catch(() => {});
      }
      setSoftwareZoomActive(true);
      return;
    }
    
    // zoom >= 1：尝试硬件zoom
    if (hardwareZoomAvailable && trackRef.current) {
      // 硬件zoom值限制在硬件支持范围内
      const hwZoom = Math.min(clampedZoom, hardwareZoomMax);
      applyZoomToTrack(trackRef.current, hwZoom).then(success => {
        if (success) {
          // 硬件zoom成功
          // 如果UI zoom > 硬件最大值，剩余部分用软件zoom
          setSoftwareZoomActive(clampedZoom > hardwareZoomMax);
        } else {
          // 硬件zoom失败，回退到软件zoom
          setSoftwareZoomActive(true);
        }
      }).catch(() => {
        setSoftwareZoomActive(true);
      });
    } else {
      // 硬件不可用，使用软件zoom
      setSoftwareZoomActive(true);
    }
  }, [minZoom, maxZoom, isFrontCamera, hardwareZoomAvailable, hardwareZoomMax]);

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
