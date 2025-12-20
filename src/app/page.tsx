'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Lightbulb, Volume2, VolumeX, Music, Mic } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CollectionGrid } from '@/components/CollectionGrid';
import { CameraView } from '@/components/CameraView';
import { VictoryModal } from '@/components/VictoryModal';
import { ReviewMode } from '@/components/ReviewMode';
import { ProfilePage } from '@/components/ProfilePage';
import { WordBook } from '@/components/WordBook';
import { BottomNav } from '@/components/BottomNav';
import { AchievementToast } from '@/components/AchievementToast';
import { useSound } from '@/hooks/useSound';
import { useBgm } from '@/hooks/useBgm';
import { AIRecognitionResult, GameMode } from '@/types';

// 成就定义
const ACHIEVEMENTS = [
  { id: 'collect_5', title: '初出茅庐', desc: '收集5个碎片', icon: 'star' as const, threshold: 5, type: 'collect' },
  { id: 'collect_20', title: '小有成就', desc: '收集20个碎片', icon: 'star' as const, threshold: 20, type: 'collect' },
  { id: 'collect_50', title: '收藏家', desc: '收集50个碎片', icon: 'star' as const, threshold: 50, type: 'collect' },
  { id: 'collect_100', title: '博物馆馆长', desc: '收集100个碎片', icon: 'trophy' as const, threshold: 100, type: 'collect' },
  { id: 'master_5', title: '学习新手', desc: '掌握5个单词', icon: 'zap' as const, threshold: 5, type: 'master' },
  { id: 'master_20', title: '词汇达人', desc: '掌握20个单词', icon: 'zap' as const, threshold: 20, type: 'master' },
  { id: 'master_50', title: '英语高手', desc: '掌握50个单词', icon: 'award' as const, threshold: 50, type: 'master' },
  { id: 'diamond_10', title: '小富翁', desc: '获得10颗钻石', icon: 'diamond' as const, threshold: 10, type: 'diamond' },
  { id: 'diamond_50', title: '钻石大亨', desc: '获得50颗钻石', icon: 'diamond' as const, threshold: 50, type: 'diamond' },
];

export default function HomePage() {
  const { state, dispatch, startNewGame, nextWord } = useGame();
  const { currentWord, collectedImages, phase, userData, showHint, mode } = state;
  const [showVictory, setShowVictory] = useState(false);
  const { playClick, playSuccess } = useSound();
  const { toggleBgm, isPlaying: isBgmPlaying } = useBgm();
  
  // 新增状态
  const [hintLevel, setHintLevel] = useState(0); // 0=无提示, 1=英文提示, 2=中文提示
  const [hintButtonFlashing, setHintButtonFlashing] = useState<1 | 2 | false>(false); // 提示按钮闪烁: 1=引导第一次, 2=引导第二次
  const [isCardSwitching, setIsCardSwitching] = useState(false); // 换词动画状态
  const [countdown, setCountdown] = useState(60); // 60秒倒计时
  const [isPaused, setIsPaused] = useState(false); // 拍照时暂停倒计时
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null); // 新收集的图片URL（用于动画）
  const [showImageAnimation, setShowImageAnimation] = useState(false); // 显示图片飞入动画
  const [unlockedAchievement, setUnlockedAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null); // 新解锁的成就
  const prevUserDataRef = useRef(userData); // 用于检测成就变化
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimer2Ref = useRef<NodeJS.Timeout | null>(null); // 第二次提示计时器
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false); // 防止重复处理的锁

  // 初始化游戏
  useEffect(() => {
    if (!currentWord && mode === 'HUNTER') {
      startNewGame();
    }
  }, [currentWord, startNewGame, mode]);

  // 检测成就解锁 - 只在收集新图片时触发，不在初始加载时触发
  const prevTotalCollectedRef = useRef<number>(-1); // -1 表示未初始化
  const mountedTimeRef = useRef<number>(0);
  
  // 组件挂载后等待2秒才开始检测成就，避免初始加载触发
  useEffect(() => {
    mountedTimeRef.current = Date.now();
  }, []);
  
  useEffect(() => {
    // 组件挂载后2秒内不检测成就
    if (Date.now() - mountedTimeRef.current < 2000) {
      prevTotalCollectedRef.current = userData.totalCollected;
      return;
    }
    
    // 首次有效检测，记录当前值
    if (prevTotalCollectedRef.current === -1) {
      prevTotalCollectedRef.current = userData.totalCollected;
      return;
    }
    
    // 只有当 totalCollected 增加时才检测成就
    if (userData.totalCollected <= prevTotalCollectedRef.current) {
      return;
    }
    
    const prevTotal = prevTotalCollectedRef.current;
    prevTotalCollectedRef.current = userData.totalCollected;
    
    // 检查收集类成就
    for (const achievement of ACHIEVEMENTS) {
      if (achievement.type !== 'collect') continue;
      
      if (prevTotal < achievement.threshold && userData.totalCollected >= achievement.threshold) {
        setUnlockedAchievement(achievement);
        return;
      }
    }
    
    // 检查钻石成就
    for (const achievement of ACHIEVEMENTS) {
      if (achievement.type !== 'diamond') continue;
      
      if (prevTotal < achievement.threshold && userData.diamonds >= achievement.threshold) {
        setUnlockedAchievement(achievement);
        return;
      }
    }
  }, [userData.totalCollected, userData.diamonds]);

  // 模式切换处理
  const handleModeChange = (newMode: GameMode) => {
    dispatch({ type: 'SET_MODE', payload: newMode });
  };

  // 换词处理（带动画）- 必须在条件返回之前定义
  const handleSwitchWord = useCallback(() => {
    setIsCardSwitching(true);
    setTimeout(() => {
      nextWord();
      setHintLevel(0);
      setHintButtonFlashing(false);
      setCountdown(60);
      setIsPaused(false);
      
      // 重新启动倒计时
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleSwitchWord();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      
      // 重新启动提示引导
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (idleTimer2Ref.current) clearTimeout(idleTimer2Ref.current);
      idleTimerRef.current = setTimeout(() => {
        setHintButtonFlashing(1);
      }, 10000);
      idleTimer2Ref.current = setTimeout(() => {
        setHintButtonFlashing(2);
      }, 20000);
      
      setTimeout(() => {
        setIsCardSwitching(false);
      }, 300);
    }, 300);
  }, [nextWord]);

  // 识别成功后自动跳转下一个单词 - 停留2秒让用户看到图片在框里
  useEffect(() => {
    if (phase === 'SUCCESS' && mode === 'HUNTER') {
      // 2秒后自动跳转到下一个单词
      const timer = setTimeout(() => {
        // 直接调用换词逻辑，避免循环依赖
        setIsCardSwitching(true);
        setTimeout(() => {
          nextWord();
          setHintLevel(0);
          setHintButtonFlashing(false);
          setCountdown(60);
          setIsPaused(false);
          
          // 重新启动倒计时
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                return 60;
              }
              return prev - 1;
            });
          }, 1000);
          
          setTimeout(() => {
            setIsCardSwitching(false);
          }, 300);
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, nextWord, mode]);

  // 重置提示和计时器 - 必须在条件返回之前定义
  const resetHintAndTimer = useCallback(() => {
    setHintLevel(0);
    setHintButtonFlashing(false);
    setCountdown(60);
    setIsPaused(false);
    
    // 清除旧计时器
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (idleTimer2Ref.current) clearTimeout(idleTimer2Ref.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    // 10秒后开始闪烁提示按钮（引导第一次英文提示）
    idleTimerRef.current = setTimeout(() => {
      setHintButtonFlashing(1);
    }, 10000);
    
    // 20秒后引导第二次提示（中文）
    idleTimer2Ref.current = setTimeout(() => {
      setHintButtonFlashing(prev => prev === 1 ? 1 : 2); // 如果还没点第一次，保持闪烁
    }, 20000);
    
    // 开始60秒倒计时
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // 倒计时结束，自动换词
          handleSwitchWord();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleSwitchWord]);

  // 当单词改变时重置计时器 - 只在单词ID变化时重置，切换模式不重置
  useEffect(() => {
    if (currentWord && mode === 'HUNTER' && countdown === 60) {
      // 只有倒计时为60（初始状态）时才重置
      resetHintAndTimer();
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (idleTimer2Ref.current) clearTimeout(idleTimer2Ref.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [currentWord?.id]);
  
  // 切换回HUNTER模式时恢复倒计时（不重置）
  useEffect(() => {
    if (mode === 'HUNTER' && !countdownTimerRef.current && countdown < 60 && countdown > 0) {
      // 恢复倒计时
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleSwitchWord();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (mode !== 'HUNTER' && countdownTimerRef.current) {
      // 切换到其他模式时暂停倒计时
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, [mode, handleSwitchWord]);

  // 拍照时暂停/恢复倒计时
  useEffect(() => {
    const isCameraActive = phase === 'CAMERA' || phase === 'ANALYZING' || phase === 'FAILED' || phase === 'SUCCESS';
    
    if (isCameraActive && !isPaused) {
      // 暂停倒计时
      setIsPaused(true);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      if (idleTimer2Ref.current) {
        clearTimeout(idleTimer2Ref.current);
        idleTimer2Ref.current = null;
      }
    } else if (!isCameraActive && isPaused && mode === 'HUNTER') {
      // 恢复倒计时
      setIsPaused(false);
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleSwitchWord();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [phase, isPaused, mode, handleSwitchWord]);

  // 根据模式渲染不同页面
  if (mode === 'REVIEW') {
    return (
      <>
        <ReviewMode onBack={() => handleModeChange('HUNTER')} />
        <BottomNav currentMode={mode} onModeChange={handleModeChange} />
      </>
    );
  }

  if (mode === 'COLLECTION') {
    return (
      <>
        <WordBook onBack={() => handleModeChange('HUNTER')} />
        <BottomNav currentMode={mode} onModeChange={handleModeChange} />
      </>
    );
  }

  if (mode === 'WORDBOOK') {
    return (
      <>
        <ProfilePage />
        <BottomNav currentMode={mode} onModeChange={handleModeChange} />
      </>
    );
  }

  // AI 识别处理
  const handleAnalyze = async (imageData: string) => {
    if (!currentWord) return;
    
    // 防止重复处理
    if (isProcessingRef.current) {
      console.log('Already processing, skip');
      return;
    }
    isProcessingRef.current = true;

    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageData,
          targetWord: currentWord.word,
          targetWordCn: currentWord.cn,
        }),
      });

      const result = await response.json();

      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
        dispatch({ type: 'RETRY' });
        isProcessingRef.current = false;
        return;
      }

      const aiResult: AIRecognitionResult = result;

      if (aiResult.is_match) {
        // 播放成功音效
        playSuccess();
        // 暂时移除抠图，直接用原图
        setNewImageUrl(imageData);
        setShowImageAnimation(true);
        dispatch({
          type: 'ANALYSIS_SUCCESS',
          payload: { result: aiResult, imageUrl: imageData },
        });
        // 2秒后隐藏动画和重置锁
        setTimeout(() => {
          setShowImageAnimation(false);
          setNewImageUrl(null);
          isProcessingRef.current = false;
        }, 2000);
      } else {
        dispatch({ type: 'ANALYSIS_FAILED', payload: aiResult });
        isProcessingRef.current = false;
      }
    } catch (error) {
      console.error('分析错误:', error);
      dispatch({ type: 'SET_ERROR', payload: '网络错误，请重试' });
      dispatch({ type: 'RETRY' });
      isProcessingRef.current = false;
    }
  };

  // 手动确认正确
  const handleForceSuccess = async (imageData: string) => {
    // 防止重复处理
    if (isProcessingRef.current) {
      console.log('Already processing, skip force success');
      return;
    }
    isProcessingRef.current = true;
    
    dispatch({ type: 'START_ANALYZING' });
    // 暂时移除抠图，直接用原图
    setNewImageUrl(imageData);
    setShowImageAnimation(true);
    dispatch({ type: 'FORCE_SUCCESS', payload: imageData });
    // 2秒后隐藏动画和重置锁
    setTimeout(() => {
      setShowImageAnimation(false);
      setNewImageUrl(null);
      isProcessingRef.current = false;
    }, 2000);
  };

  // 使用提示（新逻辑：第一次英文，第二次中文）
  const handleUseHint = () => {
    if (hintLevel === 0) {
      // 第一次点击：显示英文提示
      setHintLevel(1);
      setHintButtonFlashing(false);
      // 如果还没到20秒，设置20秒后引导第二次提示
      if (idleTimer2Ref.current) {
        clearTimeout(idleTimer2Ref.current);
      }
      idleTimer2Ref.current = setTimeout(() => {
        setHintButtonFlashing(2);
      }, 10000); // 点击后10秒引导第二次
    } else if (hintLevel === 1) {
      // 第二次点击：显示中文提示
      setHintLevel(2);
      setHintButtonFlashing(false);
      if (idleTimer2Ref.current) {
        clearTimeout(idleTimer2Ref.current);
      }
    }
  };

  // 发音
  const handleSpeak = () => {
    if (currentWord && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // SUCCESS 状态时不显示相机，显示收集栏让用户看到图片已添加
  const isCameraActive = phase === 'CAMERA' || phase === 'ANALYZING' || phase === 'FAILED';

  // 开始相机 - 暂停倒计时
  const handleStartCamera = () => {
    playClick();
    // 暂停倒计时
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setIsPaused(true);
    dispatch({ type: 'START_CAMERA' });
  };

  // 停止相机 - 恢复倒计时
  const handleStopCamera = () => {
    dispatch({ type: 'STOP_CAMERA' });
    // 恢复倒计时
    setIsPaused(false);
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 拍照处理 - 确保倒计时暂停直到识别完成
  const handleCapture = async (imageData: string) => {
    // 确保倒计时暂停
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setIsPaused(true);
    
    dispatch({ type: 'CAPTURE_IMAGE', payload: imageData });
    dispatch({ type: 'START_ANALYZING' });
    await handleAnalyze(imageData);
  };

  // Hunter Page 布局
  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden pb-24">
      {/* 整体卡片容器 - 带换词动画 */}
      <motion.div
        animate={{
          scale: isCardSwitching ? 0.8 : 1,
          opacity: isCardSwitching ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >
        {/* Top: 单词卡片区域 */}
        <div className="bg-bg z-10 px-4 pt-4 pb-2">
          <AnimatePresence mode="wait">
            {currentWord && (
              <motion.div
                key={currentWord.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-bg-secondary rounded-3xl border border-text/10 shadow-card p-4"
              >
                {/* 单词和操作按钮 */}
                <div className="flex items-center justify-between mb-2">
                  {/* 左侧：背景音乐 + 发音 */}
                  <div className="flex items-center gap-2">
                    {/* 背景音乐按钮 - 使用Music图标 */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleBgm}
                      className={`p-2 rounded-xl border shadow-soft ${isBgmPlaying ? 'bg-success border-success/30' : 'bg-bg-tertiary border-text/10'}`}
                      title={isBgmPlaying ? '关闭背景音乐' : '开启背景音乐'}
                    >
                      <Music className={`w-5 h-5 ${isBgmPlaying ? 'text-text-onPrimary' : 'text-text-muted'}`} />
                    </motion.button>
                    
                    {/* 发音按钮 - 使用Mic图标 */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSpeak}
                      className="p-2 rounded-xl bg-accent border border-accent/30 shadow-soft"
                      title="朗读单词"
                    >
                      <Mic className="w-5 h-5 text-text-onPrimary" />
                    </motion.button>
                  </div>
                  
                  {/* 右侧：提示 + 换词 */}
                  <div className="flex items-center gap-2">
                    {/* 提示按钮 - 带闪烁和浮动效果 */}
                    <div className="relative">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleUseHint}
                        disabled={hintLevel >= 2}
                        animate={hintButtonFlashing ? { 
                          scale: [1, 1.1, 1],
                          y: [0, -3, 0],
                          boxShadow: ['0 0 0 0 rgba(255, 213, 79, 0)', '0 0 0 8px rgba(255, 213, 79, 0.4)', '0 0 0 0 rgba(255, 213, 79, 0)']
                        } : {}}
                        transition={hintButtonFlashing ? { duration: 1.5, repeat: Infinity } : {}}
                        className={`p-2 rounded-xl border shadow-soft flex items-center gap-1 ${
                          hintLevel < 2 ? 'bg-secondary border-secondary-border' : 'bg-bg-tertiary border-text/10 opacity-50'
                        }`}
                        title={hintLevel === 0 ? '查看英文提示' : hintLevel === 1 ? '查看中文提示' : '已显示全部提示'}
                      >
                        <Lightbulb className="w-5 h-5 text-text" />
                      </motion.button>
                    </div>
                    
                    {/* 换词按钮 */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSwitchWord}
                      className="p-2 rounded-xl bg-warning border border-warning/30 shadow-soft"
                      title="换一个单词"
                    >
                      <RefreshCw className="w-5 h-5 text-text" />
                    </motion.button>
                  </div>
                </div>

                {/* 单词显示 - 一开始不显示中文 */}
                <div className="text-center py-3">
                  <h2 className="text-5xl font-black text-text tracking-wide">
                    {currentWord.word}
                  </h2>
                </div>

                {/* 提示显示 - 分级显示：第一次英文，第二次中文 */}
                <AnimatePresence>
                  {hintLevel >= 1 && hintLevel < 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-secondary-soft rounded-xl border border-dashed border-secondary-border/50"
                    >
                      <p className="text-base font-bold text-text text-center">
                        💡 {currentWord.hintEn || currentWord.hint}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {hintLevel >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 text-center"
                    >
                      <div className="inline-block bg-success/20 px-4 py-2 rounded-full border border-success">
                        <span className="text-base font-black text-text">{currentWord.cn} - {currentWord.hint}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Middle: 相机或卡槽区域 */}
        <div className="flex-1 px-4 py-2 overflow-hidden relative">
          {isCameraActive ? (
            /* 相机视图 */
            <div className="h-full rounded-3xl overflow-hidden border border-text/10 shadow-card">
              <CameraView
                onCapture={handleCapture}
                onClose={handleStopCamera}
                onForceSuccess={handleForceSuccess}
              />
            </div>
          ) : (
            /* 2x3 卡槽 Grid + 圆形拍照按钮 */
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-text">
                  {phase === 'SUCCESS' ? '🎉 收集成功！' : '收集进度'}
                </h3>
                <span className="text-sm font-black text-primary">{collectedImages.length}/6</span>
              </div>
              
              {/* 收集框 */}
              <div className="mb-4">
                <CollectionGrid images={collectedImages} highlightLast={phase === 'SUCCESS'} />
              </div>
              
              {/* START HUNTING 按钮 - 在收集框下方居中，SUCCESS时隐藏 */}
              {phase !== 'SUCCESS' && (
                <div className="flex-1 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartCamera}
                    disabled={!currentWord}
                    className="w-40 h-40 rounded-full bg-primary hover:bg-primary-hover shadow-soft-lg text-text-onPrimary font-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hunting-button"
                  >
                    <span className="text-xl font-black tracking-wide">START<br/>HUNTING</span>
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* 图片飞入卡槽动画 */}
      <AnimatePresence>
        {showImageAnimation && newImageUrl && (
          <motion.div
            initial={{ scale: 1, x: '50%', y: '30%', opacity: 1 }}
            animate={{ scale: 0.2, x: '20%', y: '60%', opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <img 
              src={newImageUrl} 
              alt="captured" 
              className="w-48 h-48 object-cover rounded-2xl shadow-soft-lg border-4 border-success"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部倒计时进度条 - 最后10秒紧迫感动画 */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
        <motion.div 
          className="h-4 bg-bg-tertiary rounded-full overflow-hidden"
          animate={countdown <= 10 ? { 
            scale: [1, 1.02, 1],
            boxShadow: ['0 0 0 0 rgba(229, 115, 115, 0)', '0 0 8px 2px rgba(229, 115, 115, 0.5)', '0 0 0 0 rgba(229, 115, 115, 0)']
          } : {}}
          transition={countdown <= 10 ? { duration: 0.5, repeat: Infinity } : {}}
        >
          <motion.div
            className={`h-full ${
              countdown <= 10 
                ? 'bg-gradient-to-r from-primary to-error' 
                : countdown <= 30 
                  ? 'bg-gradient-to-r from-secondary to-primary'
                  : 'bg-gradient-to-r from-success via-secondary to-primary'
            }`}
            initial={{ width: '100%' }}
            animate={{ width: `${(countdown / 60) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
        <motion.p 
          className={`text-xs text-center mt-1 font-bold ${countdown <= 10 ? 'text-primary' : 'text-text-muted'}`}
          animate={countdown <= 10 ? { scale: [1, 1.1, 1] } : {}}
          transition={countdown <= 10 ? { duration: 0.5, repeat: Infinity } : {}}
        >
          {countdown}s
        </motion.p>
      </div>

      {/* 底部导航栏 */}
      <BottomNav currentMode={mode} onModeChange={handleModeChange} />

      {/* 胜利弹窗 */}
      {currentWord && (
        <VictoryModal
          isOpen={showVictory}
          word={currentWord}
          onNextWord={() => { setShowVictory(false); nextWord(); }}
          onViewCollection={() => { setShowVictory(false); handleModeChange('WORDBOOK'); }}
        />
      )}

      {/* 错误提示 */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 bg-primary text-text-onPrimary px-4 py-3 rounded-2xl shadow-soft-lg z-40"
          >
            <p className="text-sm font-medium">{state.error}</p>
            <button
              onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
              className="absolute top-2 right-3 text-white/80 hover:text-white font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成就解锁通知 */}
      <AchievementToast 
        achievement={unlockedAchievement} 
        onClose={() => setUnlockedAchievement(null)} 
      />
    </div>
  );
}
