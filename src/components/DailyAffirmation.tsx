import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const affirmations = [
  "You are hot. They are confused. 💅",
  "Overthinking is a skill. You're advanced. ✨",
  "You deserve effort, not confusion.",
  "If they wanted to, they would. You already know.",
  "Main character energy only. 👑",
  "Their loss is your glow-up origin story.",
  "You're too iconic to be someone's maybe.",
  "Today's vibe: unbothered (slightly bothered).",
  "Plot twist: you're the prize. 🏆",
  "Anxiety is just spicy intuition.",
  "You're not clingy, you're emotionally invested. Difference.",
  "Self-care today: stalking their socials less.",
  "Your worth isn't measured in response times. 💕",
  "Chaotic, but make it cute. That's you.",
  "Mercury retrograde can't ruin your glow. 🌟",
];

export const DailyAffirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [affirmation, setAffirmation] = useState('');

  useEffect(() => {
    // Show affirmation after a delay
    const timer = setTimeout(() => {
      setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className="glass-card rounded-2xl p-5 border-2 border-primary/30 shadow-glow">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                Daily Affirmation ✨
              </p>
              <p className="text-foreground font-medium leading-relaxed">
                {affirmation}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
