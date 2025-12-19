'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, Check, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useGame } from '@/context/GameContext';
import { GamePhase } from '@/types';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  onForceSuccess?: (imageData: string) => void;
}

export function CameraView({ onCapture, onClose, onForceSuccess }: CameraViewProps) {
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, captureImage } = useCamera();
  const { state, dispatch } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

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
    const imageData = captureImage();
    if (imageData) {
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

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden">
      {/* 隐藏的 canvas 用于截图 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 相机预览 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`camera-feed ${isAnalyzing ? 'blur-sm' : ''}`}
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
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-12 h-12 text-white" />
            </motion.div>
            <p className="text-white mt-4 text-lg font-medium">AI 正在识别...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 失败反馈覆盖层 */}
      <AnimatePresence>
        {isFailed && state.lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-xs text-center shadow-xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-slate-700 mb-2">
                我看到了 <span className="font-bold text-primary-600">{state.lastResult.detected_object_cn}</span>
              </p>
              <p className="text-slate-500 text-sm mb-4">
                {state.lastResult.feedback || '但这不是我们要找的哦~'}
              </p>
            </motion.div>
            
            {/* 手动确认按钮 - 虚化效果 */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (onForceSuccess && state.capturedImageUrl) {
                  onForceSuccess(state.capturedImageUrl);
                } else {
                  dispatch({ type: 'FORCE_SUCCESS', payload: state.capturedImageUrl || '' });
                }
              }}
              className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/70 text-sm border border-white/30"
            >
              I promise it&apos;s correct
            </motion.button>
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
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white mt-4 text-xl font-bold"
            >
              Awesome! +1 Found
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white p-6">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-primary-500 rounded-full text-white"
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
        className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10"
      >
        <X className="w-5 h-5" />
      </motion.button>

      {/* 底部控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center">
        {!isAnalyzing && !isSuccess && (
          <>
            {isFailed ? (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'RETRY' })}
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full text-slate-700 font-medium shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                再试一次
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCapture}
                disabled={!isStreaming}
                className="shutter-btn w-20 h-20 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-slate-600" />
                </div>
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
