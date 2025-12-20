'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { CollectedImage } from '@/types';

interface CollectionGridProps {
  images: CollectedImage[];
  maxSlots?: number;
  highlightLast?: boolean;
}

// 空卡槽呼吸动画
const breathingAnimation = {
  scale: [1, 1.02, 1],
  opacity: [0.5, 0.7, 0.5],
};

export function CollectionGrid({ images, maxSlots = 6, highlightLast = false }: CollectionGridProps) {
  const slots = Array.from({ length: maxSlots }, (_, i) => images[i] || null);
  const lastFilledIndex = images.length - 1;

  return (
    <div className="grid grid-cols-6 gap-2">
      <AnimatePresence>
        {slots.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              aspect-square rounded-2xl overflow-hidden relative
              ${image 
                ? 'bg-bg-secondary border border-text/10 shadow-card' 
                : 'border border-dashed border-text/20 bg-bg-tertiary'
              }
              ${highlightLast && index === lastFilledIndex ? 'ring-4 ring-success ring-offset-2 ring-offset-bg-primary' : ''}
            `}
          >
            {image ? (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full h-full relative"
                style={{
                  background: 'linear-gradient(135deg, #FFFDF5 0%, #F5F8FC 100%)',
                }}
              >
                <img
                  src={image.url}
                  alt={image.detectedObject}
                  className="w-full h-full object-contain p-0.5"
                  style={{
                    filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.15))',
                  }}
                />
                {/* 成功标记 */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.2 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full border border-success/50 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-text-onPrimary" strokeWidth={3} />
                </motion.div>
              </motion.div>
            ) : (
              /* 空卡槽 - 呼吸动画 */
              <motion.div 
                animate={breathingAnimation}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  delay: index * 0.3 
                }}
                className="w-full h-full flex items-center justify-center text-text-muted"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
