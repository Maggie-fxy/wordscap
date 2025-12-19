'use client';

import { motion } from 'framer-motion';
import { Diamond, Trophy, Calendar, Hash, RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';

interface ProfilePageProps {
  onBack?: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { state } = useGame();
  const { userData } = state;

  // 计算已掌握的单词数
  const masteredCount = Object.values(userData.wordRecords).filter(r => r.mastered).length;
  const collectedCount = Object.values(userData.wordRecords).filter(r => r.images.length > 0).length;

  // 生成用户ID（基于首次使用时间）
  const userId = `WC${String(userData.totalCollected + 1000).padStart(6, '0')}`;
  
  // 模拟注册日期
  const registerDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // 重置游戏
  const handleReset = () => {
    if (confirm('确定要重置所有游戏进度吗？此操作不可撤销！')) {
      localStorage.removeItem('wordcaps_user_data');
      window.location.reload();
    }
  };

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden pb-20">
      {/* Header */}
      <header className="px-4 py-6 text-center">
        <h1 className="text-2xl font-black text-text">My Hunter Pass</h1>
        <p className="text-text-secondary text-sm mt-1">你的狩猎通行证</p>
      </header>

      {/* License Card - 身份证/护照样式 */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/90 to-primary rounded-3xl p-5 shadow-soft-lg relative overflow-hidden"
        >
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="flex items-start gap-4 relative z-10">
            {/* 头像 */}
            <div className="w-20 h-20 bg-bg-secondary rounded-2xl flex items-center justify-center shadow-soft-md flex-shrink-0">
              <span className="text-4xl">🦊</span>
            </div>
            
            {/* 信息 */}
            <div className="flex-1 text-text-onPrimary">
              <h2 className="text-xl font-black mb-3">Word Hunter</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 opacity-70" />
                  <span className="font-mono font-bold">{userId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-70" />
                  <span className="opacity-90">{registerDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 底部装饰线 */}
          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
            <span className="text-xs text-white/60 font-medium">WORDCAPS OFFICIAL</span>
            <span className="text-xs text-white/60 font-mono">v1.0</span>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid - 2个大方块 */}
      <div className="px-4 grid grid-cols-2 gap-4 mb-6">
        {/* 钻石数 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-secondary rounded-3xl p-5 border border-text/10 shadow-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <Diamond className="w-6 h-6 text-secondary fill-secondary/50" />
            </div>
          </div>
          <p className="text-4xl font-black text-text">{userData.diamonds}</p>
          <p className="text-sm text-text-secondary mt-1">💎 Diamonds</p>
        </motion.div>

        {/* 已掌握 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-secondary rounded-3xl p-5 border border-text/10 shadow-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-success" />
            </div>
          </div>
          <p className="text-4xl font-black text-text">{masteredCount}</p>
          <p className="text-sm text-text-secondary mt-1">🏆 Mastered</p>
        </motion.div>
      </div>

      {/* 额外统计 */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-tertiary rounded-2xl p-4"
        >
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-black text-text">{collectedCount}</p>
              <p className="text-xs text-text-muted">已收集</p>
            </div>
            <div className="w-px bg-text/10" />
            <div>
              <p className="text-2xl font-black text-text">{userData.totalCollected}</p>
              <p className="text-xs text-text-muted">总照片</p>
            </div>
            <div className="w-px bg-text/10" />
            <div>
              <p className="text-2xl font-black text-text">
                {collectedCount > 0 ? Math.round((masteredCount / collectedCount) * 100) : 0}%
              </p>
              <p className="text-xs text-text-muted">掌握率</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer - Reset Button */}
      <div className="px-4 mt-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="w-full py-3 bg-bg-tertiary text-text-muted rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-error/10 hover:text-error transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Game (Debug)
        </motion.button>
      </div>
    </div>
  );
}
