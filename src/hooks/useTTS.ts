'use client';

import { useCallback, useRef } from 'react';
import { pauseBgmForTTS, resumeBgmAfterTTS } from '@/components/BgmHost';

export function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 使用有道词典在线发音 API（兼容微信浏览器）
  const speakEnglish = useCallback((text: string) => {
    try {
      // 停止之前的播放
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // 暂停 BGM
      pauseBgmForTTS();
      
      // 有道词典发音 API
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
      
      const audio = new Audio(url);
      audio.volume = 1;
      audioRef.current = audio;
      
      // TTS 播放结束后恢复 BGM
      audio.onended = () => {
        resumeBgmAfterTTS();
      };
      audio.onerror = () => {
        resumeBgmAfterTTS();
      };
      
      audio.play().catch(e => {
        console.log('TTS播放失败:', e);
        resumeBgmAfterTTS();
        // 降级到原生 speechSynthesis
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = 0.9;
          utterance.onend = () => resumeBgmAfterTTS();
          window.speechSynthesis.speak(utterance);
        }
      });
    } catch (e) {
      console.log('TTS错误:', e);
      resumeBgmAfterTTS();
    }
  }, []);

  const speakChinese = useCallback((text: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // 暂停 BGM
      pauseBgmForTTS();
      
      // 有道词典中文发音
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`;
      
      const audio = new Audio(url);
      audio.volume = 1;
      audioRef.current = audio;
      
      // TTS 播放结束后恢复 BGM
      audio.onended = () => {
        resumeBgmAfterTTS();
      };
      audio.onerror = () => {
        resumeBgmAfterTTS();
      };
      
      audio.play().catch(e => {
        console.log('TTS播放失败:', e);
        resumeBgmAfterTTS();
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'zh-CN';
          utterance.onend = () => resumeBgmAfterTTS();
          window.speechSynthesis.speak(utterance);
        }
      });
    } catch (e) {
      console.log('TTS错误:', e);
      resumeBgmAfterTTS();
    }
  }, []);

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (lang.startsWith('zh')) {
      speakChinese(text);
    } else {
      speakEnglish(text);
    }
  }, [speakEnglish, speakChinese]);

  return {
    speak,
    speakEnglish,
    speakChinese,
  };
}
