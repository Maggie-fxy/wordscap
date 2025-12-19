'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star } from 'lucide-react';
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
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 py-3 bg-bg border-b border-text/10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 rounded-xl bg-warning border border-warning/30 shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-text" />
        </motion.button>
        <h1 className="text-xl font-black text-text">单词本</h1>
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

      {/* 单词列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {collectedWords.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-4">
              <Star className="w-10 h-10 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">还没有收集任何单词</p>
            <p className="text-text-muted text-sm mt-1">去捕猎模式开始收集吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {collectedWords.map((item, index) => (
              <motion.div
                key={item.wordId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-bg-secondary rounded-2xl border border-text/10 shadow-card p-3"
              >
                <div className="flex items-center gap-3">
                  {/* 单词信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-text truncate">
                        {item.word?.word}
                      </h3>
                      {item.mastered && (
                        <div className="w-5 h-5 bg-success rounded-full border border-success/50 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-text-onPrimary" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">{item.word?.cn}</p>
                  </div>

                  {/* 收集的图片缩略图 */}
                  <div className="flex -space-x-2">
                    {item.images.slice(0, 6).map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="w-10 h-10 rounded-lg border border-text/20 overflow-hidden bg-accent/10"
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {item.images.length > 6 && (
                      <div className="w-10 h-10 rounded-lg border border-text/20 bg-text flex items-center justify-center">
                        <span className="text-xs font-bold text-text-onPrimary">+{item.images.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 学习进度 */}
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className="text-text-muted">
                    选择题: <span className="font-bold text-text">{item.choiceCorrect}</span>次
                  </span>
                  <span className="text-text-muted">
                    默写: <span className="font-bold text-text">{item.spellingCorrect}</span>次
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作 */}
      {collectedWords.length > 0 && (
        <div className="p-4 border-t border-text/10 bg-bg">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-text-onPrimary rounded-2xl font-black shadow-soft-md"
          >
            继续捕猎
          </motion.button>
        </div>
      )}
    </div>
  );
}
