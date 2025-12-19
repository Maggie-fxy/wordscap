'use client';

import { motion } from 'framer-motion';
import { Target, GraduationCap, User } from 'lucide-react';
import { GameMode } from '@/types';

interface BottomNavProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function BottomNav({ currentMode, onModeChange }: BottomNavProps) {
  const navItems = [
    { mode: 'HUNTER' as GameMode, icon: Target, label: '狩猎' },
    { mode: 'REVIEW' as GameMode, icon: GraduationCap, label: '复习' },
    { mode: 'WORDBOOK' as GameMode, icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-text/10 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.mode}
              whileTap={{ scale: 0.9 }}
              onClick={() => onModeChange(item.mode)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-bold ${isActive ? 'text-primary' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
