'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star, Plus } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getWordById } from '@/data/wordBank';

interface WordBookProps {
  onBack: () => void;
}

export function WordBook({ onBack }: WordBookProps) {
  const { state } = useGame();
  const { userData } = state;

  // 获取有收集记录的单词
  const collectedWords = Object.values(userData.wordRecords)
    .filter(record => record.images.length > 0)
    .map(record => ({
      ...record,
      word: getWordById(record.wordId),
    }))
    .filter(item => item.word);

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden pb-20">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 py-3 bg-bg border-b border-text/10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 rounded-xl bg-warning border border-warning/30 shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-text" />
        </motion.button>
        <h1 className="text-xl font-black text-text">收集册</h1>
        <div className="w-10" />
      </header>

      {/* 统计信息 */}
      <div className="px-4 py-3 bg-bg-tertiary border-b border-text/10">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-black text-text">{collectedWords.length}</p>
            <p className="text-xs text-text-secondary font-medium">已收集</p>
          </div>
          <div>
            <p className="text-2xl font-black text-primary">
              {collectedWords.filter(w => w.mastered).length}
            </p>
            <p className="text-xs text-text-secondary font-medium">已掌握</p>
          </div>
          <div>
            <p className="text-2xl font-black text-secondary">
              {collectedWords.reduce((sum, w) => sum + w.images.length, 0)}
            </p>
            <p className="text-xs text-text-secondary font-medium">总照片</p>
          </div>
        </div>
      </div>

      {/* 单词列表 - 底部留出空间给固定按钮 */}
      <div className="flex-1 overflow-y-auto p-4 pb-40">
        {collectedWords.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-4">
              <Star className="w-10 h-10 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">还没有收集任何单词</p>
            <p className="text-text-muted text-sm mt-1">去捕猎模式开始收集吧！</p>
            
            {/* 空状态下的圆形按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="mt-6 w-32 h-32 rounded-full bg-primary hover:bg-primary-hover shadow-soft-lg text-text-onPrimary font-black flex items-center justify-center hunting-button"
            >
              <span className="text-base font-black tracking-wide">START<br/>HUNTING</span>
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {collectedWords.map((item, index) => (
              <motion.div
                key={item.wordId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.08,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                className="bg-bg-secondary rounded-2xl border border-text/10 shadow-card p-4"
              >
                {/* 单词信息 */}
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-black text-text">
                    {item.word?.word}
                  </h3>
                  <span className="text-sm text-text-secondary">({item.word?.cn})</span>
                  {item.mastered && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, delay: index * 0.08 + 0.2 }}
                      className="w-5 h-5 bg-success rounded-full border border-success/50 flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-3 h-3 text-text-onPrimary" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* 6个收集框 - 类似狩猎界面 */}
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, slotIndex) => {
                    const img = item.images[slotIndex];
                    return (
                      <motion.div
                        key={slotIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 + slotIndex * 0.03 }}
                        className={`
                          aspect-square rounded-xl overflow-hidden
                          ${img 
                            ? 'bg-bg-tertiary border border-text/10 shadow-card' 
                            : 'border border-dashed border-text/20 bg-bg-tertiary'
                          }
                        `}
                      >
                        {img ? (
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted opacity-30">
                            <Plus className="w-4 h-4" strokeWidth={2} />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* 底部固定圆形按钮 */}
      {collectedWords.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-32 h-32 rounded-full bg-primary hover:bg-primary-hover shadow-soft-lg text-text-onPrimary font-black flex items-center justify-center pointer-events-auto hunting-button"
          >
            <span className="text-base font-black tracking-wide">CONTINUE<br/>HUNTING</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
