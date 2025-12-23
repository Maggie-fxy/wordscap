'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

const BGM_ENABLED_KEY = 'wordcaps_bgm_enabled';

interface BgmContextType {
  isPlaying: boolean;
  hasEverStarted: boolean;
  playBgm: () => void;
  stopBgm: () => void;
  toggleBgm: () => void;
}

const BgmContext = createContext<BgmContextType | undefined>(undefined);

function getInitialBgmState(): boolean {
  // 初始状态为 false，等待用户交互后再播放（避免浏览器自动播放限制）
  // 实际的"是否启用BGM"偏好存储在 localStorage，由 playBgm 时读取
  return false;
}

function getBgmPreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(BGM_ENABLED_KEY);
    if (raw === null) {
      localStorage.setItem(BGM_ENABLED_KEY, '1');
      return true;
    }
    return raw === '1';
  } catch {
    return true;
  }
}

export function BgmProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(getInitialBgmState);
  const [hasEverStarted, setHasEverStarted] = useState(false);

  const persist = useCallback((enabled: boolean) => {
    try {
      localStorage.setItem(BGM_ENABLED_KEY, enabled ? '1' : '0');
    } catch {
      // ignore
    }
  }, []);

  const playBgm = useCallback(() => {
    // 只有当用户偏好是开启时才播放
    if (getBgmPreference()) {
      setIsPlaying(true);
      setHasEverStarted(true);
    }
  }, []);

  const stopBgm = useCallback(() => {
    setIsPlaying(false);
    persist(false);
  }, [persist]);

  const toggleBgm = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      persist(next);
      if (next) {
        setHasEverStarted(true);
      }
      return next;
    });
  }, [persist]);

  return (
    <BgmContext.Provider value={{ isPlaying, hasEverStarted, playBgm, stopBgm, toggleBgm }}>
      {children}
    </BgmContext.Provider>
  );
}

export function useBgm() {
  const ctx = useContext(BgmContext);
  if (!ctx) {
    throw new Error('useBgm must be used within a BgmProvider');
  }
  return ctx;
}
