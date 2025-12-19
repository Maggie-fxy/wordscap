'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Lightbulb, Volume2, Camera, Sparkles } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CollectionGrid } from '@/components/CollectionGrid';
import { CameraView } from '@/components/CameraView';
import { VictoryModal } from '@/components/VictoryModal';
import { ReviewMode } from '@/components/ReviewMode';
import { ProfilePage } from '@/components/ProfilePage';
import { BottomNav } from '@/components/BottomNav';
import { AIRecognitionResult, GameMode } from '@/types';

export default function HomePage() {
  const { state, dispatch, startNewGame, nextWord } = useGame();
  const { currentWord, collectedImages, phase, userData, showHint, mode } = state;
  const [showVictory, setShowVictory] = useState(false);

  // 初始化游戏
  useEffect(() => {
    if (!currentWord && mode === 'HUNTER') {
      startNewGame();
    }
  }, [currentWord, startNewGame, mode]);

  // 识别成功后自动跳转下一个单词
  useEffect(() => {
    if (phase === 'SUCCESS' && mode === 'HUNTER') {
      // 1.5秒后自动跳转到下一个单词
      const timer = setTimeout(() => {
        nextWord();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, nextWord, mode]);

  // 模式切换处理
  const handleModeChange = (newMode: GameMode) => {
    dispatch({ type: 'SET_MODE', payload: newMode });
  };

  // 根据模式渲染不同页面
  if (mode === 'REVIEW') {
    return (
      <>
        <ReviewMode onBack={() => handleModeChange('HUNTER')} />
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

  // 抠图处理
  const handleSegment = async (imageData: string): Promise<string> => {
    try {
      const response = await fetch('/api/segment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageData,
          objectName: currentWord?.word || '',
        }),
      });

      const result = await response.json();
      
      if (result.success && result.segmentedImage) {
        return result.segmentedImage;
      }
      return imageData;
    } catch (error) {
      console.error('抠图错误:', error);
      return imageData;
    }
  };

  // AI 识别处理
  const handleAnalyze = async (imageData: string) => {
    if (!currentWord) return;

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
        return;
      }

      const aiResult: AIRecognitionResult = result;

      if (aiResult.is_match) {
        const segmentedImage = await handleSegment(imageData);
        dispatch({
          type: 'ANALYSIS_SUCCESS',
          payload: { result: aiResult, imageUrl: segmentedImage },
        });
      } else {
        dispatch({ type: 'ANALYSIS_FAILED', payload: aiResult });
      }
    } catch (error) {
      console.error('分析错误:', error);
      dispatch({ type: 'SET_ERROR', payload: '网络错误，请重试' });
      dispatch({ type: 'RETRY' });
    }
  };

  // 手动确认正确
  const handleForceSuccess = async (imageData: string) => {
    dispatch({ type: 'START_ANALYZING' });
    const segmentedImage = await handleSegment(imageData);
    dispatch({ type: 'FORCE_SUCCESS', payload: segmentedImage });
  };

  // 使用提示
  const handleUseHint = () => {
    if (userData.diamonds >= 1) {
      dispatch({ type: 'USE_HINT' });
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

  const isCameraActive = phase === 'CAMERA' || phase === 'ANALYZING' || phase === 'FAILED' || phase === 'SUCCESS';

  // 开始相机
  const handleStartCamera = () => {
    dispatch({ type: 'START_CAMERA' });
  };

  // 停止相机
  const handleStopCamera = () => {
    dispatch({ type: 'STOP_CAMERA' });
  };

  // 拍照处理
  const handleCapture = async (imageData: string) => {
    dispatch({ type: 'CAPTURE_IMAGE', payload: imageData });
    dispatch({ type: 'START_ANALYZING' });
    await handleAnalyze(imageData);
  };

  // Hunter Page 布局
  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden pb-20">
      {/* Top: 单词卡片区域 - 始终显示 */}
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
                <div className="flex items-center gap-2">
                  {/* 发音按钮 */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSpeak}
                    className="p-2 rounded-xl bg-accent border border-accent/30 shadow-soft"
                  >
                    <Volume2 className="w-5 h-5 text-text-onPrimary" />
                  </motion.button>
                  
                  {/* 提示按钮 */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleUseHint}
                    disabled={userData.diamonds < 1}
                    className={`p-2 rounded-xl border shadow-soft flex items-center gap-1 ${
                      userData.diamonds >= 1 ? 'bg-secondary border-secondary-border' : 'bg-bg-tertiary border-text/10 opacity-50'
                    }`}
                    title={userData.diamonds >= 1 ? '使用1颗钻石查看提示' : '钻石不足'}
                  >
                    <Lightbulb className="w-5 h-5 text-text" />
                    <span className="text-xs font-bold">1</span>
                  </motion.button>
                </div>
                
                {/* 换词按钮 */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => nextWord()}
                  className="p-2 rounded-xl bg-warning border border-warning/30 shadow-soft"
                  title="换一个单词"
                >
                  <RefreshCw className="w-5 h-5 text-text" />
                </motion.button>
              </div>

              {/* 单词显示 */}
              <div className="text-center py-2">
                <h2 className="text-4xl font-black text-text tracking-wide">
                  {currentWord.word}
                </h2>
                <div className="mt-2 inline-block bg-success/20 px-4 py-1 rounded-full border border-success">
                  <span className="text-sm font-bold text-text">{currentWord.cn}</span>
                </div>
              </div>

              {/* 提示显示 */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-secondary-soft rounded-xl border border-dashed border-secondary-border/50"
                  >
                    <p className="text-sm text-text text-center">
                      💡 {currentWord.hint}
                    </p>
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
          /* 相机视图 - 在卡槽区域显示，不遮挡单词 */
          <div className="h-full rounded-3xl overflow-hidden border border-text/10 shadow-card">
            <CameraView
              onCapture={handleCapture}
              onClose={handleStopCamera}
              onForceSuccess={handleForceSuccess}
            />
          </div>
        ) : (
          /* 2x3 卡槽 Grid */
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text">收集进度</h3>
              <span className="text-sm font-black text-primary">{collectedImages.length}/6</span>
            </div>
            <CollectionGrid images={collectedImages} />
          </>
        )}
      </div>

      {/* Bottom: START HUNTING 悬浮大按钮 - 相机激活时隐藏 */}
      {!isCameraActive && (
        <div className="px-4 pb-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartCamera}
            disabled={!currentWord}
            className="w-full py-4 bg-primary hover:bg-primary-hover rounded-2xl shadow-soft-lg text-text-onPrimary font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Camera className="w-7 h-7" />
            <span>START HUNTING</span>
            <Sparkles className="w-6 h-6" />
          </motion.button>
        </div>
      )}

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
    </div>
  );
}
