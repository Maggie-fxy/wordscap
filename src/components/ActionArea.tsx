'use client';

import { motion } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CameraView } from './CameraView';

interface ActionAreaProps {
  onAnalyze: (imageData: string) => Promise<void>;
  onForceSuccess?: (imageData: string) => Promise<void>;
}

export function ActionArea({ onAnalyze, onForceSuccess }: ActionAreaProps) {
  const { state, dispatch } = useGame();
  const { phase, currentWord } = state;

  const isIdle = phase === 'IDLE';

  const handleStartCamera = () => {
    dispatch({ type: 'START_CAMERA' });
  };

  const handleStopCamera = () => {
    dispatch({ type: 'STOP_CAMERA' });
  };

  const handleCapture = async (imageData: string) => {
    dispatch({ type: 'CAPTURE_IMAGE', payload: imageData });
    dispatch({ type: 'START_ANALYZING' });
    await onAnalyze(imageData);
  };

  return (
    <div className="h-full min-h-[200px] bg-bg-tertiary relative overflow-hidden rounded-t-3xl">
      {isIdle ? (
        // 待机态 - Light Ethereal Warmth 风格
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full" />
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-accent/10 rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-secondary/10 rounded-full" />
          </div>

          {/* CTA 按钮 */}
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={handleStartCamera}
            disabled={!currentWord}
            className="relative z-10 flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-hover rounded-2xl shadow-soft-lg text-text-onPrimary font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Camera className="w-7 h-7" />
            <span>START HUNTING</span>
            <Sparkles className="w-6 h-6" />
          </motion.button>

          {/* 提示文字 */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary mt-4 text-sm font-medium"
          >
            找到物品并拍照收集！
          </motion.p>

          {!currentWord && (
            <p className="text-text-muted mt-2 text-sm">请先选择一个单词</p>
          )}
        </div>
      ) : (
        // 相机激活态
        <CameraView
          onCapture={handleCapture}
          onClose={handleStopCamera}
          onForceSuccess={onForceSuccess}
        />
      )}
    </div>
  );
}
