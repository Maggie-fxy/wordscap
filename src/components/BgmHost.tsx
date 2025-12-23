'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { BgmProvider, useBgm } from '@/hooks/useBgm';

// 全局单例 audio 实例，确保切换栏目时不被重新创建
let globalAudio: HTMLAudioElement | null = null;
let bgmWasPlaying = false;
let ttsPaused = false; // TTS 主动暂停的标记
let bgmShouldPlay = false; // BGM 应该播放的状态

function getGlobalAudio(): HTMLAudioElement {
  if (!globalAudio && typeof window !== 'undefined') {
    globalAudio = document.createElement('audio');
    globalAudio.src = '/bgm.mp3';
    globalAudio.loop = true;
    globalAudio.volume = 0.5;
    globalAudio.preload = 'auto';
    // @ts-ignore - playsInline 是有效属性
    globalAudio.playsInline = true;
    
    // 监听意外暂停事件，自动恢复播放（微信浏览器兼容）
    globalAudio.addEventListener('pause', () => {
      // 如果不是 TTS 主动暂停的，且应该播放，则立即恢复
      if (!ttsPaused && bgmShouldPlay) {
        // 使用 requestAnimationFrame 实现更丝滑的恢复
        requestAnimationFrame(() => {
          if (globalAudio && bgmShouldPlay && !ttsPaused) {
            globalAudio.play().catch(() => {});
          }
        });
      }
    });
  }
  return globalAudio!;
}

// 导出函数供 TTS 使用：暂停 BGM
export function pauseBgmForTTS() {
  // 先设置标记，再暂停，确保 pause 事件监听器不会误恢复
  ttsPaused = true;
  const audio = globalAudio;
  if (audio && !audio.paused) {
    bgmWasPlaying = true;
    audio.pause();
  }
}

// 导出函数供 TTS 使用：恢复 BGM
export function resumeBgmAfterTTS() {
  ttsPaused = false;
  const audio = globalAudio;
  if (audio && bgmWasPlaying) {
    bgmWasPlaying = false;
    audio.play().catch(() => {});
  }
}

// 设置 BGM 应该播放的状态
export function setBgmShouldPlay(shouldPlay: boolean) {
  bgmShouldPlay = shouldPlay;
}

function BgmPlayer() {
  const { isPlaying } = useBgm();
  const hasInitRef = useRef(false);

  useEffect(() => {
    const audio = getGlobalAudio();
    if (!audio) return;

    // 同步全局状态
    setBgmShouldPlay(isPlaying);

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
