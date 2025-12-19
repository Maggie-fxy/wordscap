'use client';

import { motion } from 'framer-motion';
import { Volume2, Lightbulb, Star } from 'lucide-react';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';

interface WordCardProps {
  word: Word;
}

export function WordCard({ word }: WordCardProps) {
  const { speakEnglish } = useTTS();

  const handleSpeak = () => {
    speakEnglish(word.word);
  };

  // 难度星星显示
  const renderDifficultyStars = () => {
    return Array.from({ length: word.difficulty }, (_, i) => (
      <Star
        key={i}
        className="w-4 h-4 fill-yellow-400 text-yellow-400"
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mx-4"
    >
      {/* 难度标识 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wide">
          {word.category}
        </span>
        <div className="flex items-center gap-1">
          {renderDifficultyStars()}
          <span className="text-xs text-slate-500 ml-1">+{word.difficulty}碎片</span>
        </div>
      </div>

      {/* 单词主体 */}
      <div className="text-center">
        <motion.h1
          className="text-5xl font-bold text-slate-800 tracking-wide"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {word.word}
        </motion.h1>
        <p className="text-xl text-slate-500 mt-2">{word.cn}</p>
      </div>

      {/* 功能按钮 */}
      <div className="flex justify-center gap-4 mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSpeak}
          className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-sm font-medium">发音</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition-colors"
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-medium">提示</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
