import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

interface TailPoint {
  x: number;
  y: number;
}

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isPointer, setIsPointer] = useState(false);
  const [tail, setTail] = useState<TailPoint[]>([]);
  const sparkleId = useRef(0);
  const lastSparkleTime = useRef(0);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Update tail
      setTail(prev => {
        const newTail = [...prev, { x: e.clientX, y: e.clientY }];
        return newTail.slice(-12);
      });

      // Add sparkles on movement
      const now = Date.now();
      if (now - lastSparkleTime.current > 50) {
        lastSparkleTime.current = now;
        const newSparkle = {
          id: sparkleId.current++,
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
        };
        setSparkles(prev => [...prev.slice(-8), newSparkle]);
      }

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"], input, textarea, [data-clickable]');
      setIsPointer(!!clickable);
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  // Remove old sparkles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setSparkles(prev => prev.slice(-5));
    }, 200);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {/* Tail */}
      {tail.map((point, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: point.x,
            top: point.y,
            width: 8 - i * 0.5,
            height: 8 - i * 0.5,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: (i / tail.length) * 0.5, 
            scale: 1 - (i / tail.length) * 0.5,
            x: -4,
            y: -4,
          }}
          transition={{ duration: 0.1 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(135deg, hsl(340 82% 65%), hsl(280 60% 75%))`,
            }}
          />
        </motion.div>
      ))}

      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            className="fixed pointer-events-none z-[9997]"
            style={{ left: sparkle.x, top: sparkle.y }}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-lg">✨</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{ left: position.x, top: position.y }}
        animate={{ 
          scale: isPointer ? 1.5 : 1,
          x: -12,
          y: -12,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div className="relative">
          <span className="text-2xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,157,0.6))' }}>
            {isPointer ? '💖' : '🐱'}
          </span>
        </div>
      </motion.div>
    </>
  );
};
