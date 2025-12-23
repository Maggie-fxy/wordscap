'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, BookOpen, GraduationCap, User } from 'lucide-react';
import { GameMode } from '@/types';
import { useSound } from '@/hooks/useSound';

interface BottomNavProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function BottomNav({ currentMode, onModeChange }: BottomNavProps) {
  const { playNav } = useSound();
  
  const navItems = [
    { mode: 'HUNTER' as GameMode, icon: Target, label: '狩猎' },
    { mode: 'COLLECTION' as GameMode, icon: BookOpen, label: '收集册' },
    { mode: 'REVIEW' as GameMode, icon: GraduationCap, label: '复习' },
    { mode: 'WORDBOOK' as GameMode, icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 wood-bg border-t-4 border-[#5D4037] px-2 py-1.5 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.mode}
              whileTap={{ scale: 0.95, y: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                playNav();
                onModeChange(item.mode);
              }}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white border-2 border-[#5D4037] border-b-4' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {/* 图标 */}
              <Icon 
                className={`w-5 h-5 relative z-10 ${
                  isActive ? 'text-[#5D4037]' : 'text-white drop-shadow-md'
                }`} 
                strokeWidth={2.5}
              />
              
              <span className={`text-[10px] font-black relative z-10 ${
                isActive ? 'text-[#5D4037]' : 'text-white drop-shadow-md'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
