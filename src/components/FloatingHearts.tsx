import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
}

const emojis = ['💕', '💖', '✨', '🌸', '💗', '🎀', '⭐', '💫', '🌙', '🦋'];

export const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const addHeart = () => {
      const heart: Heart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 2,
        duration: 8 + Math.random() * 6,
        size: 16 + Math.random() * 20,
      };
      setHearts(prev => [...prev.slice(-15), heart]);
    };

    const interval = setInterval(addHeart, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{ 
              left: `${heart.x}%`,
              fontSize: heart.size,
            }}
            initial={{ y: '100vh', opacity: 0, rotate: -20 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 0.8, 0.8, 0],
              rotate: [0, 10, -10, 0],
              x: [0, 20, -20, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: heart.duration, 
              delay: heart.delay,
              ease: 'linear',
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
