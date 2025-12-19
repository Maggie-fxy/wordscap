'use client';

import { useCallback } from 'react';

export function useTTS() {
  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      // 取消之前的语音
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // 稍慢一点，适合学习
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    }
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
