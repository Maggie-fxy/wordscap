'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, BookOpen, GraduationCap, User } from 'lucide-react';
import { GameMode } from '@/types';

interface BottomNavProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function BottomNav({ currentMode, onModeChange }: BottomNavProps) {
  const navItems = [
    { mode: 'HUNTER' as GameMode, icon: Target, label: '狩猎' },
    { mode: 'COLLECTION' as GameMode, icon: BookOpen, label: '收集册' },
    { mode: 'REVIEW' as GameMode, icon: GraduationCap, label: '复习' },
    { mode: 'WORDBOOK' as GameMode, icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-text/10 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = currentMode === item.mode;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.mode}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={() => onModeChange(item.mode)}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {/* 激活状态背景 */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="navBackground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                  />
                )}
              </AnimatePresence>
              
              {/* 图标 - 激活时弹跳 */}
              <motion.div
                animate={isActive ? { y: [0, -3, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon className={`w-6 h-6 relative z-10 ${isActive ? 'text-primary' : ''}`} />
              </motion.div>
              
              <span className={`text-xs font-bold relative z-10 ${isActive ? 'text-primary' : ''}`}>
                {item.label}
              </span>
              
              {/* 底部指示点 */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute -bottom-0.5 w-1.5 h-1.5 bg-primary rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
