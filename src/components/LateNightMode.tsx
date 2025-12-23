import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface LateNightModeProps {
  onModeChange: (isLateNight: boolean) => void;
}

export const LateNightMode = ({ onModeChange }: LateNightModeProps) => {
  const [isLateNight, setIsLateNight] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 22 || hour < 6; // 10 PM - 6 AM
      
      if (isNight !== isLateNight) {
        setIsLateNight(isNight);
        onModeChange(isNight);
        
        if (isNight) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isLateNight, onModeChange]);

  // Toggle for testing
  const toggleMode = () => {
    const newMode = !isLateNight;
    setIsLateNight(newMode);
    onModeChange(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('late-night');
    } else {
      document.documentElement.classList.remove('late-night');
    }
  };

  useEffect(() => {
    if (isLateNight) {
      document.documentElement.classList.add('late-night');
    } else {
      document.documentElement.classList.remove('late-night');
    }
  }, [isLateNight]);

  return (
    <>
      <button
        onClick={toggleMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full glass-card hover:scale-110 transition-transform"
        title={isLateNight ? "Switch to Day Mode" : "Switch to Late Night Mode"}
      >
        <AnimatePresence mode="wait">
          {isLateNight ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <Moon className="w-5 h-5 text-secondary" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Sun className="w-5 h-5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 p-4 rounded-2xl glass-card border-2 border-secondary/50 max-w-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <p className="font-bold text-foreground">Late Night Mode Activated</p>
                <p className="text-sm text-muted-foreground">Extra dramatic energy unlocked ✨</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
