'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Diamond, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: 'star' | 'trophy' | 'zap' | 'diamond' | 'award';
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const iconMap = {
  star: Star,
  trophy: Trophy,
  zap: Zap,
  diamond: Diamond,
  award: Award,
};

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  useEffect(() => {
    if (achievement) {
      // 触发撒花效果
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
      
      confetti({
        ...defaults,
        particleCount: 80,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FFD54F', '#F2C94C', '#FFF4CC', '#FFE082', '#FF6B6B'],
      });

      // 3秒后自动关闭
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  const Icon = achievement ? iconMap[achievement.icon] : Star;

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="bg-gradient-to-br from-secondary via-secondary to-warning p-1 rounded-3xl shadow-2xl pointer-events-auto"
            onClick={onClose}
          >
            <div className="bg-bg-secondary rounded-3xl p-6 text-center min-w-[280px]">
              {/* 光芒背景 */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/30 to-secondary/0 rounded-3xl"
              />
              
              {/* 图标 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center relative"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-secondary/50"
                />
                <Icon className="w-10 h-10 text-secondary" />
              </motion.div>

              {/* 文字 */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-secondary font-bold mb-1"
              >
                🎉 成就解锁！
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-black text-text mb-1"
              >
                {achievement.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-text-secondary"
              >
                {achievement.desc}
              </motion.p>

              {/* 点击提示 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="text-xs text-text-muted mt-4"
              >
                点击关闭
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
