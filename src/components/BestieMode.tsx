import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

interface BestieModeProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const bestieQuotes = [
  "Block him. 🔪",
  "If he wanted to, he would.",
  "You deserve better, babe.",
  "That's not your man, that's a red flag in disguise.",
  "Main character behavior only. 👑",
];

export const BestieMode = ({ enabled, onToggle }: BestieModeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/20">
            <span className="text-2xl">👯‍♀️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Fake Bestie Mode</h3>
            <p className="text-sm text-muted-foreground">Extra dramatic support</p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <p className="text-sm text-foreground italic">
            "{bestieQuotes[Math.floor(Math.random() * bestieQuotes.length)]}"
          </p>
          <p className="text-xs text-muted-foreground mt-2">— Your Fake Bestie 💕</p>
        </motion.div>
      )}
    </motion.div>
  );
};
