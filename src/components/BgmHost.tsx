'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { BgmProvider, useBgm } from '@/hooks/useBgm';

// 全局单例 audio 实例，确保切换栏目时不被重新创建
let globalAudio: HTMLAudioElement | null = null;
let bgmWasPlaying = false;

function getGlobalAudio(): HTMLAudioElement {
  if (!globalAudio && typeof window !== 'undefined') {
    globalAudio = document.createElement('audio');
    globalAudio.src = '/bgm.mp3';
    globalAudio.loop = true;
    globalAudio.volume = 0.5;
    globalAudio.preload = 'auto';
    // @ts-ignore - playsInline 是有效属性
    globalAudio.playsInline = true;
  }
  return globalAudio!;
}

// 导出函数供 TTS 使用：暂停 BGM
export function pauseBgmForTTS() {
  const audio = globalAudio;
  if (audio && !audio.paused) {
    bgmWasPlaying = true;
    audio.pause();
  }
}

// 导出函数供 TTS 使用：恢复 BGM
export function resumeBgmAfterTTS() {
  const audio = globalAudio;
  if (audio && bgmWasPlaying) {
    bgmWasPlaying = false;
    audio.play().catch(() => {});
  }
}

function BgmPlayer() {
  const { isPlaying } = useBgm();
  const hasInitRef = useRef(false);

  useEffect(() => {
    const audio = getGlobalAudio();
    if (!audio) return;

    if (isPlaying) {
      // 微信浏览器需要用户交互后才能播放
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log('BGM autoplay blocked:', e);
        });
      }
    } else {
      audio.pause();
    }
    
    hasInitRef.current = true;
  }, [isPlaying]);

  // 不渲染任何 DOM，使用全局 audio 实例
  return null;
}

export function BgmHost({ children }: { children: ReactNode }) {
  return (
    <BgmProvider>
      <BgmPlayer />
      {children}
    </BgmProvider>
  );
}
