'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useTTS() {
  const voicesLoadedRef = useRef(false);
  const englishVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  
  // 预加载语音引擎
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
        // 优先选择英语语音
        englishVoiceRef.current = voices.find(v => v.lang.startsWith('en')) || voices[0];
        console.log('语音引擎已加载:', voices.length, '个语音');
      }
    };
    
    // 立即尝试加载
    loadVoices();
    
    // 监听语音列表变化
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      console.log('speechSynthesis not supported');
      return;
    }
    
    // 取消之前的语音
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // 稍慢一点，适合学习
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // 使用预加载的语音
    if (englishVoiceRef.current && lang.startsWith('en')) {
      utterance.voice = englishVoiceRef.current;
    }
    
    // 添加错误处理
    utterance.onerror = (e) => {
      console.log('语音播放错误:', e.error);
      // 如果失败，尝试重试一次
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return; // 这些不是真正的错误
      }
      setTimeout(() => {
        const retryUtterance = new SpeechSynthesisUtterance(text);
        retryUtterance.lang = lang;
        retryUtterance.rate = 0.9;
        window.speechSynthesis.speak(retryUtterance);
      }, 100);
    };
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakEnglish = useCallback((text: string) => {
    speak(text, 'en-US');
  }, [speak]);

  const speakChinese = useCallback((text: string) => {
    speak(text, 'zh-CN');
  }, [speak]);

  return {
    speak,
    speakEnglish,
    speakChinese,
  };
}
