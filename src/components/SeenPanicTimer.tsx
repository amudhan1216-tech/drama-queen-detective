import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const panicMessages = [
  "Breathe. You are still hot. 💅",
  "They're probably sleeping... or ignoring.",
  "They saw it. They're just building suspense.",
  "Maybe their phone died. At 87%.",
  "They're definitely drafting a response. For 3 hours.",
  "Plot twist: they're showing their friends. 📱",
  "Their wifi is probably bad. Very bad. For hours.",
  "They're thinking of the PERFECT reply. Sure.",
  "Mercury is in retrograde. Blame the stars. ✨",
  "You're worth more than a response. But also... WHERE IS IT?",
  "Stay calm. Panicking won't help. (It will)",
  "They forgor 💀",
  "This is a test. You're failing. Gracefully.",
  "Time moves slower when you're anxious. Science.",
];

const stages = [
  { time: 0, stage: "Calm", emoji: "😌", color: "from-kawaii-mint to-kawaii-sky" },
  { time: 60, stage: "Slightly Concerned", emoji: "🤔", color: "from-kawaii-sky to-secondary" },
  { time: 300, stage: "Mild Panic", emoji: "😰", color: "from-secondary to-kawaii-lavender" },
  { time: 600, stage: "Full Spiral", emoji: "😱", color: "from-kawaii-lavender to-primary" },
  { time: 1800, stage: "Accepted Fate", emoji: "💀", color: "from-primary to-destructive" },
  { time: 3600, stage: "Ghosted Era", emoji: "👻", color: "from-destructive to-foreground" },
];

export const SeenPanicTimer = () => {
  const [seenTime, setSeenTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentStage = () => {
    for (let i = stages.length - 1; i >= 0; i--) {
      if (elapsedSeconds >= stages[i].time) {
        return stages[i];
      }
    }
    return stages[0];
  };

  const startPanic = () => {
    if (!seenTime) return;
    
    const [hours, minutes] = seenTime.split(':').map(Number);
    const seenDate = new Date();
    seenDate.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - seenDate.getTime()) / 1000);
    
    setElapsedSeconds(Math.max(0, diff));
    setIsRunning(true);
    setCurrentMessage(panicMessages[Math.floor(Math.random() * panicMessages.length)]);

    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    messageIntervalRef.current = setInterval(() => {
      setCurrentMessage(panicMessages[Math.floor(Math.random() * panicMessages.length)]);
    }, 4000);
  };

  const stopPanic = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stage = getCurrentStage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-accent/40">
          <Eye className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold sparkle-text">Seen Panic Timer</h2>
          <p className="text-muted-foreground text-sm">Track your descent into madness</p>
        </div>
      </div>

      {!isRunning ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              When was your message seen? ⏰
            </label>
            <Input
              type="time"
              value={seenTime}
              onChange={(e) => setSeenTime(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary rounded-xl h-12"
            />
          </div>
          <Button 
            onClick={startPanic}
            disabled={!seenTime}
            className="kawaii-btn w-full h-12 rounded-2xl bg-gradient-to-r from-accent to-kawaii-peach text-accent-foreground font-semibold text-lg gap-2"
          >
            <Clock className="w-5 h-5" />
            Start Panic Mode 😰
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className={`p-6 rounded-2xl bg-gradient-to-r ${stage.color} text-center`}>
            <motion.div
              key={elapsedSeconds}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-5xl md:text-6xl font-bold text-primary-foreground font-mono"
            >
              {formatTime(elapsedSeconds)}
            </motion.div>
            <p className="text-primary-foreground/80 mt-2">since they saw it and chose violence</p>
          </div>

          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-card/50 border border-border">
            <span className="text-4xl">{stage.emoji}</span>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Current State</p>
              <p className="text-xl font-bold text-foreground">{stage.stage}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-primary/10 border border-primary/20"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-foreground italic">{currentMessage}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <Button 
            onClick={stopPanic}
            variant="outline"
            className="w-full h-12 rounded-2xl border-2 border-primary/30 hover:bg-primary/10"
          >
            Stop the Madness 🛑
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
