import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Heart, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const emotionalStatuses = [
  "Dry Texter 🏜️",
  "Emotionally Constipated",
  "Vibing in Another Dimension",
  "Breadcrumb Specialist",
  "Hot & Cold Enthusiast",
  "Professional Ghoster",
  "Chaos Coordinator",
  "Situationship Survivor",
  "Red Flag Collector",
  "Bare Minimum Expert",
];

const interestLevels = [
  "Legally Dead 💀",
  "Bare Minimum Certified",
  "On Life Support",
  "Room Temperature Energy",
  "Suspiciously Low",
  "404: Interest Not Found",
  "Flatlined",
  "Expired Last Tuesday",
];

const vibes = [
  "Confusing but intentional ✨",
  "Main character but you're an extra",
  "2AM energy at 2PM",
  "Chaotic neutral with a hint of evil",
  "NPC behavior detected",
  "Giving... nothing. Literally nothing.",
  "Unhinged but make it fashion",
  "Passive aggressive masterclass",
];

const riskLevels = [
  "Therapy required immediately",
  "Block and heal",
  "Proceed with caution ⚠️",
  "Run. Don't walk.",
  "This is a drill (it's not)",
];

export const MoodDetector = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    status: string;
    interest: string;
    vibe: string;
    risk: string;
    percentage: number;
  } | null>(null);

  const analyze = () => {
    setIsAnalyzing(true);
    setResults(null);

    setTimeout(() => {
      setResults({
        status: emotionalStatuses[Math.floor(Math.random() * emotionalStatuses.length)],
        interest: interestLevels[Math.floor(Math.random() * interestLevels.length)],
        vibe: vibes[Math.floor(Math.random() * vibes.length)],
        risk: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        percentage: Math.floor(Math.random() * 30) + 5, // Always low for drama
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-secondary/40">
          <Activity className="w-6 h-6 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold sparkle-text">Fake Mood Detector</h2>
          <p className="text-muted-foreground text-sm">100% scientifically inaccurate analysis</p>
        </div>
      </div>

      <Button 
        onClick={analyze}
        disabled={isAnalyzing}
        className="kawaii-btn w-full h-12 rounded-2xl bg-gradient-to-r from-secondary to-kawaii-lavender text-secondary-foreground font-semibold text-lg gap-2"
      >
        <Zap className="w-5 h-5" />
        {isAnalyzing ? 'Scanning Their Energy...' : 'Analyze Their Vibe 🔮'}
      </Button>

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="mt-4 text-muted-foreground animate-pulse">Detecting emotional damage...</p>
        </motion.div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Emotional Status</span>
              </div>
              <p className="font-bold text-foreground">{results.status}</p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-secondary-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Interest Level</span>
              </div>
              <p className="font-bold text-foreground">{results.interest}</p>
            </div>

            <div className="p-4 rounded-2xl bg-accent/20 border border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">✨</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vibe Check</span>
              </div>
              <p className="font-bold text-foreground">{results.vibe}</p>
            </div>

            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">⚠️</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Assessment</span>
              </div>
              <p className="font-bold text-foreground">{results.risk}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-destructive/10 border border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Effort Being Put Into You</span>
              <span className="text-2xl font-bold text-primary">{results.percentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${results.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-destructive"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-center italic">
              This is concerning. Very concerning.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
