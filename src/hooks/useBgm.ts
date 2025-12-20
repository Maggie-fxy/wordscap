'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

// 游戏冒险风格背景音乐 - 使用Web Audio API生成
export function useBgm() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const nodesRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
    masterGain: GainNode | null;
  }>({ oscillators: [], gains: [], masterGain: null });
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // 冒险风格的音符序列 (C大调五声音阶 + 一些变化)
  const melodyNotes = [
    262, 294, 330, 392, 440, // C4, D4, E4, G4, A4
    392, 330, 294, 262, 294, // G4, E4, D4, C4, D4
    330, 392, 440, 523, 440, // E4, G4, A4, C5, A4
    392, 330, 294, 330, 262, // G4, E4, D4, E4, C4
  ];

  const bassNotes = [
    131, 131, 147, 147, // C3, C3, D3, D3
    165, 165, 196, 196, // E3, E3, G3, G3
    131, 131, 147, 147, // C3, C3, D3, D3
    165, 196, 165, 131, // E3, G3, E3, C3
  ];

  // 播放背景音乐
  const playBgm = useCallback(() => {
    if (isPlayingRef.current) return;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      isPlayingRef.current = true;
      setIsPlaying(true);

      // 创建主音量控制
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.15; // 背景音乐音量较低
      masterGain.connect(ctx.destination);
      nodesRef.current.masterGain = masterGain;

      let noteIndex = 0;
      const noteInterval = 300; // 每个音符300ms

      const playNote = () => {
        if (!isPlayingRef.current) return;

        const currentCtx = audioContextRef.current;
        if (!currentCtx) return;

        // 旋律音
        const melodyOsc = currentCtx.createOscillator();
        const melodyGain = currentCtx.createGain();
        melodyOsc.connect(melodyGain);
        melodyGain.connect(masterGain);
        
        melodyOsc.frequency.value = melodyNotes[noteIndex % melodyNotes.length];
        melodyOsc.type = 'triangle'; // 柔和的三角波
        
        melodyGain.gain.setValueAtTime(0.3, currentCtx.currentTime);
        melodyGain.gain.exponentialRampToValueAtTime(0.01, currentCtx.currentTime + 0.25);
        
        melodyOsc.start(currentCtx.currentTime);
        melodyOsc.stop(currentCtx.currentTime + 0.25);

        // 低音 (每2个音符一个)
        if (noteIndex % 2 === 0) {
          const bassOsc = currentCtx.createOscillator();
          const bassGain = currentCtx.createGain();
          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);
          
          bassOsc.frequency.value = bassNotes[Math.floor(noteIndex / 2) % bassNotes.length];
          bassOsc.type = 'sine';
          
          bassGain.gain.setValueAtTime(0.2, currentCtx.currentTime);
          bassGain.gain.exponentialRampToValueAtTime(0.01, currentCtx.currentTime + 0.5);
          
          bassOsc.start(currentCtx.currentTime);
          bassOsc.stop(currentCtx.currentTime + 0.5);
        }

        noteIndex++;
      };

      // 立即播放第一个音符
      playNote();
      
      // 设置循环播放
      intervalRef.current = setInterval(playNote, noteInterval);

    } catch (e) {
      console.log('BGM not available:', e);
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, [getAudioContext]);

  // 停止背景音乐
  const stopBgm = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 淡出主音量
    if (nodesRef.current.masterGain && audioContextRef.current) {
      const ctx = audioContextRef.current;
      nodesRef.current.masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    }
  }, []);

  // 切换背景音乐
  const toggleBgm = useCallback(() => {
    if (isPlayingRef.current) {
      stopBgm();
    } else {
      playBgm();
    }
  }, [playBgm, stopBgm]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopBgm();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopBgm]);

  return { playBgm, stopBgm, toggleBgm, isPlaying };
}
