import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

const levels = [
  { value: 0, label: "Calm Queen 👑", description: "Healthy and balanced. Suspicious.", color: "from-kawaii-mint to-kawaii-sky" },
  { value: 25, label: "Slightly Concerned", description: "Normal person behavior.", color: "from-kawaii-sky to-secondary" },
  { value: 50, label: "Overthinking Champion 🏆", description: "Peak performance unlocked.", color: "from-secondary to-kawaii-lavender" },
  { value: 75, label: "FBI Mode 🕵️‍♀️", description: "Checking their Spotify activity.", color: "from-kawaii-lavender to-primary" },
  { value: 100, label: "Unhinged Era 🌀", description: "No thoughts, just chaos.", color: "from-primary to-destructive" },
];

interface DelusionSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const DelusionSlider = ({ value, onChange }: DelusionSliderProps) => {
  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (value >= levels[i].value) {
        return levels[i];
      }
    }
    return levels[0];
  };

  const currentLevel = getCurrentLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-kawaii-lavender/40">
          <span className="text-2xl">🌀</span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold sparkle-text">Delusion Level</h2>
          <p className="text-muted-foreground text-sm">How unhinged should the analysis be?</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`p-6 rounded-2xl bg-gradient-to-r ${currentLevel.color} text-center transition-all duration-500`}>
          <motion.div
            key={currentLevel.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{currentLevel.label}</p>
            <p className="text-primary-foreground/80 text-sm">{currentLevel.description}</p>
          </motion.div>
        </div>

        <div className="px-2">
          <Slider
            value={[value]}
            onValueChange={(vals) => onChange(vals[0])}
            max={100}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>Sane</span>
            <span>Chaotic</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {levels.map((level, i) => (
            <button
              key={level.value}
              onClick={() => onChange(level.value)}
              className={`p-2 rounded-xl text-center transition-all ${
                value >= level.value ? 'bg-primary/20 border-2 border-primary/40' : 'bg-muted/50 border-2 border-transparent'
              }`}
            >
              <span className="text-lg block">{['👑', '🤔', '🏆', '🕵️‍♀️', '🌀'][i]}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
