'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, Check, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useGame } from '@/context/GameContext';
import { useSound } from '@/hooks/useSound';
import { GamePhase } from '@/types';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  onForceSuccess?: (imageData: string) => void;
  analyzingText?: string;
  onAutoClose?: () => void; // Bug 4: 识别成功后自动关闭相机的回调
}

export function CameraView({ onCapture, onClose, onForceSuccess, analyzingText, onAutoClose }: CameraViewProps) {
  const { videoRef, canvasRef, isStreaming, isFrontCamera, error, startCamera, stopCamera, captureImage } = useCamera();
  const { state, dispatch } = useGame();
  const { playShutter, playClick } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false); // Bug 3: 拍照后暂停视频流

  useEffect(() => {
    let mounted = true;
    
    const initCamera = async () => {
      if (mounted) {
        await startCamera();
      }
    };
    
    initCamera();
    
    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  const handleCapture = () => {
    playShutter(); // 快门音效
    const imageData = captureImage();
    if (imageData) {
      // Bug 3: 拍照后暂停视频流，冻结画面
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPaused(true);
      }
      onCapture(imageData);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const isAnalyzing = state.phase === 'ANALYZING';
  const isFailed = state.phase === 'FAILED';
  const isSuccess = state.phase === 'SUCCESS';

  // Bug 3: 当重试时恢复视频流
  useEffect(() => {
    if (state.phase === 'CAMERA' && isPaused && videoRef.current) {
      videoRef.current.play();
      setIsPaused(false);
    }
  }, [state.phase, isPaused, videoRef]);

  // Bug 4: 识别成功后自动关闭相机
  useEffect(() => {
    if (isSuccess && onAutoClose) {
      // 显示成功动画1.5秒后自动关闭
      const timer = setTimeout(() => {
        stopCamera();
        onAutoClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onAutoClose, stopCamera]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden">
      {/* 隐藏的 canvas 用于截图 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 相机预览 - 只有前置摄像头才镜像 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`camera-feed ${isAnalyzing ? 'blur-sm' : ''}`}
        style={{ transform: isFrontCamera ? 'scaleX(-1)' : 'none' }}
      />

      {/* 扫描动画覆盖层 */}
      {isStreaming && !isAnalyzing && !isFailed && !isSuccess && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent scan-line opacity-50" />
        </div>
      )}

      {/* 分析中覆盖层 */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1B5E20]/80 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 bg-white rounded-full border-4 border-[#5D4037] flex items-center justify-center"
            >
              <Loader2 className="w-10 h-10 text-[#5D4037]" strokeWidth={2.5} />
            </motion.div>
            <p className="text-white mt-4 text-lg font-black drop-shadow-md">
              {analyzingText || '🔍 AI 正在识别...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 失败反馈覆盖层 - Bug 5: 重新布局避免按钮重叠 */}
      <AnimatePresence>
        {isFailed && state.lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 bg-[#1B5E20]/80 flex flex-col p-4"
          >
            {/* 上部：识别结果卡片 */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-4 max-w-[280px] text-center border-4 border-[#5D4037] border-b-8"
              >
                <div className="w-12 h-12 bg-[#FF5252] rounded-full border-4 border-[#B71C1C] flex items-center justify-center mx-auto mb-3">
                  <X className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <p className="text-[#5D4037] mb-1 font-bold text-sm">
                  我看到了 <span className="font-black text-[#FF5252]">{state.lastResult.detected_object_cn}</span>
                </p>
                <p className="text-[#1B5E20] text-xs font-bold">
                  {state.lastResult.feedback || '但这不是我们要找的哦~'}
                </p>
              </motion.div>
            </div>
            
            {/* 下部：按钮区域 - 垂直排列，上移避免被导航栏遮挡 */}
            <div className="flex flex-col gap-2 pb-2 mb-4">
              {/* 手动确认按钮 */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onForceSuccess && state.capturedImageUrl) {
                    onForceSuccess(state.capturedImageUrl);
                  } else {
                    dispatch({ type: 'FORCE_SUCCESS', payload: state.capturedImageUrl || '' });
                  }
                }}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white text-sm font-bold border-2 border-white/40 text-center"
              >
                I promise it&apos;s correct
              </motion.button>
              
              {/* 重新寻找按钮 */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'RETRY' })}
                className="btn-3d w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#4FC3F7] border-[#0288D1] rounded-2xl text-white font-black"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
                <span className="drop-shadow-md">再试一次</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成功反馈覆盖层 */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1B5E20]/80 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-20 h-20 bg-[#66BB6A] rounded-full border-4 border-[#2E7D32] border-b-8 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white drop-shadow-md" strokeWidth={3} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white mt-4 text-xl font-black drop-shadow-md"
            >
              🎉 Awesome! +1 Found
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#5D4037]/90">
          <div className="text-center text-white p-6">
            <p className="text-lg mb-4 font-bold">{error}</p>
            <button
              onClick={startCamera}
              className="btn-3d px-6 py-2 bg-[#4FC3F7] border-[#0288D1] rounded-2xl text-white font-black"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 关闭按钮 */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleClose}
        className="absolute top-4 right-4 w-10 h-10 bg-[#FF5252] border-4 border-[#B71C1C] rounded-full flex items-center justify-center text-white z-10"
      >
        <X className="w-5 h-5" strokeWidth={3} />
      </motion.button>

      {/* 底部控制栏 - 拍照按钮 */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center">
        {!isAnalyzing && !isSuccess && !isFailed && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCapture}
            disabled={!isStreaming}
            className="w-14 h-14 rounded-full bg-white border-4 border-[#5D4037] border-b-6 flex items-center justify-center disabled:opacity-50"
          >
            <div className="w-9 h-9 rounded-full bg-[#FF5252] border-[3px] border-[#B71C1C] flex items-center justify-center">
              <Camera className="w-4 h-4 text-white drop-shadow-md" strokeWidth={2.5} />
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
}
