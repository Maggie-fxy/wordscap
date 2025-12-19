'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Diamond, ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Word } from '@/types';

interface VictoryModalProps {
  isOpen: boolean;
  word: Word;
  onNextWord: () => void;
  onViewCollection: () => void;
}

export function VictoryModal({ isOpen, word, onNextWord, onViewCollection }: VictoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      // 触发撒花动画
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-text/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-bg-secondary rounded-3xl border border-text/10 shadow-soft-lg p-8 max-w-sm w-full text-center"
          >
            {/* 奖杯图标 */}
            <motion.div
              initial={{ y: -20, rotate: -10 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="w-24 h-24 bg-secondary rounded-full border border-secondary-border flex items-center justify-center mx-auto mb-6 shadow-soft-md"
            >
              <Trophy className="w-12 h-12 text-text" />
            </motion.div>

            {/* 标题 */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-black text-text mb-2"
            >
              🎉 AWESOME!
            </motion.h2>

            {/* 单词信息 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-4xl font-black text-primary mb-2">{word.word}</p>
              <div className="inline-block bg-success/20 px-4 py-1 rounded-full border border-success">
                <span className="text-sm font-bold text-text">{word.cn}</span>
              </div>
            </motion.div>

            {/* 获得钻石 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-secondary-soft rounded-2xl border border-secondary-border p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Diamond className="w-6 h-6 text-secondary-border fill-secondary" />
                <span className="text-xl font-black text-text">
                  +1 钻石
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-1 font-medium">
                成功收集了 {word.cn}！
              </p>
            </motion.div>

            {/* 操作按钮 */}
            <div className="flex flex-col gap-3">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNextWord}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-hover text-text-onPrimary rounded-2xl font-black shadow-soft-md transition-all"
              >
                <span>下一个单词</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewCollection}
                className="flex items-center justify-center gap-2 w-full py-3 bg-bg-tertiary text-text rounded-2xl font-bold border border-text/10 shadow-soft hover:shadow-soft-md transition-all"
              >
                <BookOpen className="w-5 h-5" />
                <span>查看单词本</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
