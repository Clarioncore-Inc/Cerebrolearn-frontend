import React, { useEffect, useState } from 'react';
import { Trophy, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: React.ElementType;
  type: 'badge' | 'milestone' | 'streak' | 'xp';
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const Icon = achievement.icon || Trophy;

  const colors = {
    badge: 'from-amber-500 to-orange-500',
    milestone: 'from-indigo-500 to-purple-500',
    streak: 'from-rose-500 to-pink-500',
    xp: 'from-cyan-500 to-blue-500'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="relative overflow-hidden rounded-2xl bg-card border-2 border-primary shadow-2xl">
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors[achievement.type]} opacity-10`}></div>
            
            {/* Animated sparkles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative p-6 flex items-start gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[achievement.type]} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Achievement Unlocked!</p>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-bold text-lg mb-1 text-foreground"
                >
                  {achievement.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-muted-foreground"
                >
                  {achievement.description}
                </motion.p>
              </div>

              {/* Close button */}
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              className={`h-1 bg-gradient-to-r ${colors[achievement.type]} origin-left`}
            ></motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
