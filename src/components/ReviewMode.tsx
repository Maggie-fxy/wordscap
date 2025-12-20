'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Keyboard, ArrowLeft, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { WordRecord } from '@/types';
import { getWordById, getRandomOptions } from '@/data/wordBank';
import { useSound } from '@/hooks/useSound';

interface ReviewModeProps {
  onBack: () => void;
}

export function ReviewMode({ onBack }: ReviewModeProps) {
  const { state, dispatch } = useGame();
  const { userData, reviewWord, reviewOptions, reviewPhase } = state;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [spellingInput, setSpellingInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0); // 0=无提示, 1=首字母, 2=首字母+末字母
  const [attemptCount, setAttemptCount] = useState(0); // 尝试次数
  const [showWrongHint, setShowWrongHint] = useState(false); // 显示错误提示
  const { playClick, playSuccess, playError } = useSound();

  // 获取可复习的单词（有收集记录且未掌握的，至少1张图片）
  const getReviewableWords = (): WordRecord[] => {
    return Object.values(userData.wordRecords).filter(
      record => record.images.length >= 1 && !record.mastered
    );
  };

  // 开始新的复习
  const startNewReview = () => {
    const reviewableRecords = getReviewableWords();
    console.log('可复习的单词记录:', reviewableRecords);
    if (reviewableRecords.length === 0) return;

    // 随机选择一个单词
    const randomRecord = reviewableRecords[Math.floor(Math.random() * reviewableRecords.length)];
    const word = getWordById(randomRecord.wordId);
    console.log('选中的单词:', word?.word, '图片数量:', randomRecord.images.length);
    if (!word) return;

    // 随机选择一张收集的图片
    const randomImage = randomRecord.images[Math.floor(Math.random() * randomRecord.images.length)];
    console.log('选中的图片:', randomImage?.url);
    setCurrentImage(randomImage?.url || null);

    // 判断是选择题还是默写
    const shouldSpell = randomRecord.choiceCorrect >= 1;
    
    if (shouldSpell) {
      // 直接进入默写模式
      dispatch({ 
        type: 'START_REVIEW', 
        payload: { word, options: [] } 
      });
      // 手动设置为默写阶段
      setTimeout(() => {
        dispatch({ type: 'ANSWER_CHOICE', payload: word.word });
      }, 0);
    } else {
      // 选择题模式
      const options = getRandomOptions(word, 4);
      dispatch({ 
        type: 'START_REVIEW', 
        payload: { word, options } 
      });
    }

    setSelectedAnswer(null);
    setSpellingInput('');
    setIsCorrect(null);
    setHintLevel(0);
    setAttemptCount(0);
    setShowWrongHint(false);
  };

  // 初始化
  useEffect(() => {
    const reviewableRecords = getReviewableWords();
    if (!reviewWord && reviewableRecords.length > 0) {
      startNewReview();
    }
  }, []);

  // 撒花/撒钻石特效
  const triggerConfetti = () => {
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
    
    // 撒钻石效果（使用黄色和金色）
    confetti({
      ...defaults,
      particleCount: 50,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#FFD54F', '#F2C94C', '#FFF4CC', '#FFE082'],
    });
    
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 30,
        origin: { x: 0.3, y: 0.7 },
        colors: ['#FFD54F', '#F2C94C', '#FFF4CC'],
      });
      confetti({
        ...defaults,
        particleCount: 30,
        origin: { x: 0.7, y: 0.7 },
        colors: ['#FFD54F', '#F2C94C', '#FFF4CC'],
      });
    }, 150);
  };

  // 处理选择题答案
  const handleChoiceAnswer = (answer: string) => {
    if (selectedAnswer) return; // 已经选过了
    
    playClick();
    setSelectedAnswer(answer);
    const correct = answer === reviewWord?.word;
    setIsCorrect(correct);
    
    if (correct) {
      playSuccess();
      triggerConfetti();
      // 正确后停留1.5秒，然后自动进入下一题
      setTimeout(() => {
        dispatch({ type: 'ANSWER_CHOICE', payload: answer });
        // 再等0.5秒后自动开始下一题
        setTimeout(() => {
          startNewReview();
        }, 500);
      }, 1500);
    } else {
      playError();
      dispatch({ type: 'ANSWER_CHOICE', payload: answer });
    }
  };

  // 处理默写答案
  const handleSpellingSubmit = () => {
    if (!spellingInput.trim()) return;
    
    playClick();
    const correct = spellingInput.toLowerCase().trim() === reviewWord?.word.toLowerCase();
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    if (correct) {
      playSuccess();
      setIsCorrect(true);
      setShowWrongHint(false);
      triggerConfetti();
      // 正确后停留1.5秒，然后自动进入下一题
      setTimeout(() => {
        dispatch({ type: 'ANSWER_SPELLING', payload: spellingInput });
        // 再等0.5秒后自动开始下一题
        setTimeout(() => {
          startNewReview();
        }, 500);
      }, 1500);
    } else if (newAttemptCount >= 3) {
      // 第三次失败，无法获得碎片，直接显示结果
      playError();
      setIsCorrect(false);
      setShowWrongHint(false);
      dispatch({ type: 'ANSWER_SPELLING', payload: '' }); // 传空字符串表示失败
    } else {
      // 还有机会，清空输入让用户重试
      playError();
      setSpellingInput('');
      setShowWrongHint(true);
      // 2秒后隐藏错误提示
      setTimeout(() => setShowWrongHint(false), 2000);
    }
  };

  // 下一题
  const handleNext = () => {
    playClick();
    startNewReview();
  };

  const reviewableCount = getReviewableWords().length;

  if (reviewableCount === 0) {
    return (
      <div className="h-screen bg-bg flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-black text-text mb-2">暂无可复习的单词</h2>
          <p className="text-text-secondary mb-10">去狩猎模式收集更多单词吧！</p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-32 h-32 rounded-full bg-primary hover:bg-primary-hover shadow-soft-lg text-text-onPrimary font-black flex items-center justify-center hunting-button"
            >
              <span className="text-base font-black tracking-wide text-center">START<br/>HUNTING</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

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
        <h1 className="text-xl font-black text-text">复习模式</h1>
        <div className="w-10" />
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {reviewWord && (
          <>
            {/* 图片展示区 - 占1/2 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 max-h-[50%] bg-bg-secondary rounded-3xl border border-text/10 shadow-card overflow-hidden mb-4"
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Review"
                  className="w-full h-full object-contain p-4"
                  style={{
                    background: 'linear-gradient(135deg, #FFFDF5 0%, #80CBC4 100%)',
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/10">
                  <span className="text-text-muted font-bold">无图片</span>
                </div>
              )}
            </motion.div>

            {/* 答题区 */}
            <AnimatePresence mode="wait">
              {reviewPhase === 'CHOICE' && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  <p className="text-center text-text font-black text-lg mb-4">这是什么？</p>
                  <div className="grid grid-cols-2 gap-3">
                    {reviewOptions.map((option, index) => {
                      const isSelected = selectedAnswer === option.word;
                      const isCorrectAnswer = option.word === reviewWord.word;
                      const showCorrect = selectedAnswer && isCorrectAnswer;
                      const showWrong = isSelected && !isCorrectAnswer;
                      
                      return (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            x: showWrong ? [0, -5, 5, -5, 5, 0] : 0,
                          }}
                          transition={{ 
                            delay: index * 0.1,
                            x: { duration: 0.4 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                          onClick={() => handleChoiceAnswer(option.word)}
                          disabled={selectedAnswer !== null}
                          className={`p-4 rounded-2xl border font-bold text-lg transition-all relative overflow-hidden ${
                            showCorrect
                              ? 'bg-success/20 border-success shadow-soft'
                              : showWrong
                                ? 'bg-primary text-text-onPrimary border-primary shadow-soft'
                                : 'bg-bg-secondary border-text/10 shadow-card hover:shadow-soft-md'
                          }`}
                        >
                          {/* 波纹效果 */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0.5 }}
                              animate={{ scale: 4, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className={`absolute inset-0 rounded-full ${isCorrectAnswer ? 'bg-success' : 'bg-primary'}`}
                              style={{ transformOrigin: 'center' }}
                            />
                          )}
                          <span className="text-text text-xl relative z-10">{option.word}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {reviewPhase === 'SPELLING' && (
                <motion.div
                  key="spelling"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-muted">
                        剩余 {3 - attemptCount} 次机会
                      </span>
                      <p className="text-text font-black text-lg">请拼写这个单词</p>
                      {/* 提示按钮 */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setHintLevel(prev => Math.min(prev + 1, 2))}
                        disabled={hintLevel >= 2}
                        className={`p-2 rounded-xl border shadow-soft ${
                          hintLevel > 0 
                            ? 'bg-secondary border-secondary-border' 
                            : 'bg-bg-tertiary border-text/10'
                        } ${hintLevel >= 2 ? 'opacity-50' : ''}`}
                        title={hintLevel === 0 ? '显示首字母' : hintLevel === 1 ? '显示末字母' : '已用完提示'}
                      >
                        <Lightbulb className="w-4 h-4 text-text" />
                      </motion.button>
                    </div>
                    <div className="inline-block bg-success/20 px-4 py-2 rounded-full border border-success">
                      <span className="text-base font-black text-text">{reviewWord.cn}</span>
                    </div>
                  </div>

                  {/* 拼写提示 - 根据提示等级显示 */}
                  <AnimatePresence>
                    {hintLevel > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-center"
                      >
                        <div className="inline-block bg-secondary-soft px-4 py-2 rounded-xl border border-dashed border-secondary-border/50">
                          <p className="text-sm text-text">
                            💡 首字母: <span className="font-black text-primary">{reviewWord.word[0].toUpperCase()}</span>
                            {hintLevel >= 2 && (
                              <>
                                {' · '}
                                末字母: <span className="font-black text-primary">{reviewWord.word[reviewWord.word.length - 1].toUpperCase()}</span>
                              </>
                            )}
                            {' · '}
                            共 <span className="font-black text-primary">{reviewWord.word.length}</span> 个字母
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* 错误提示 */}
                  <AnimatePresence>
                    {showWrongHint && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <span className="text-sm text-primary font-bold">❌ 拼写错误，再试一次！</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={spellingInput}
                      onChange={(e) => setSpellingInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleSpellingSubmit()}
                      placeholder="输入英文单词..."
                      className={`flex-1 p-4 rounded-2xl border font-bold text-xl text-center bg-bg-secondary shadow-card focus:outline-none focus:ring-2 focus:ring-primary ${
                        showWrongHint ? 'border-primary animate-wiggle' : 'border-text/10'
                      }`}
                      autoFocus
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSpellingSubmit}
                      className="p-4 bg-primary hover:bg-primary-hover rounded-2xl shadow-soft-md"
                    >
                      <Keyboard className="w-6 h-6 text-text-onPrimary" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {reviewPhase === 'RESULT' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className={`w-20 h-20 rounded-full border flex items-center justify-center mx-auto ${
                    isCorrect ? 'bg-success border-success/50' : 'bg-primary border-primary/50'
                  }`}>
                    {isCorrect ? (
                      <Check className="w-10 h-10 text-text-onPrimary" />
                    ) : (
                      <X className="w-10 h-10 text-text-onPrimary" />
                    )}
                  </div>
                  
                  <div>
                    <p className="text-3xl font-black text-text">{isCorrect ? '正确！' : '错误'}</p>
                    {!isCorrect && (
                      <p className="text-text-secondary mt-2">
                        正确答案: <span className="font-bold text-primary">{reviewWord.word}</span>
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-text-onPrimary rounded-2xl font-black shadow-soft-md"
                  >
                    NEXT
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
