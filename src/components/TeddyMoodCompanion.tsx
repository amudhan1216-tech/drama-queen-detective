import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

type Mood = 'calm' | 'happy' | 'sad' | 'anxious' | 'angry' | 'confused' | null;

const moodKeywords: Record<Exclude<Mood, null>, string[]> = {
  calm: ['okay', 'fine', 'chill', 'relaxed', 'peaceful', 'good', 'alright', 'neutral', 'meh'],
  happy: ['happy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'yay', 'omg', 'best', 'awesome', 'joy', 'fun'],
  sad: ['sad', 'crying', 'hurt', 'lonely', 'tired', 'exhausted', 'miss', 'broken', 'pain', 'empty', 'numb', 'depressed'],
  anxious: ['anxious', 'worried', 'scared', 'overthinking', 'panic', 'nervous', 'stress', 'afraid', 'what if', 'cant stop thinking'],
  angry: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'hate', 'upset', 'furious', 'pissed'],
  confused: ['confused', 'unsure', 'idk', 'dont know', "don't know", 'mixed', 'unclear', 'lost', 'weird', 'strange']
};

const moodResponses: Record<Exclude<Mood, null>, { message: string; animation: string }> = {
  calm: {
    message: "Hi… I'm here with you 🧸🤍",
    animation: 'wave'
  },
  happy: {
    message: "You sound happy today 🧸✨ I like this energy",
    animation: 'jump'
  },
  sad: {
    message: "Come here 🧸🤍 You don't have to be okay right now",
    animation: 'hug'
  },
  anxious: {
    message: "Let's breathe together 🧸🤍 One step at a time",
    animation: 'breathe'
  },
  angry: {
    message: "It's okay to feel this way 🧸🤍 I'm listening",
    animation: 'sit'
  },
  confused: {
    message: "It's okay to not have answers yet 🧸🤍",
    animation: 'tilt'
  }
};

const analyzeMood = (text: string): Mood => {
  const lowerText = text.toLowerCase();
  
  const moodScores: Record<Exclude<Mood, null>, number> = {
    calm: 0, happy: 0, sad: 0, anxious: 0, angry: 0, confused: 0
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        moodScores[mood as Exclude<Mood, null>] += 1;
      }
    }
  }

  const maxScore = Math.max(...Object.values(moodScores));
  if (maxScore === 0) return 'calm';
  
  return Object.entries(moodScores).find(([_, score]) => score === maxScore)?.[0] as Mood || 'calm';
};

const TeddyBear = ({ animation }: { animation: string }) => {
  const getAnimationProps = () => {
    switch (animation) {
      case 'wave':
        return {
          animate: { rotate: [0, -10, 10, -10, 0] },
          transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 }
        };
      case 'jump':
        return {
          animate: { y: [0, -20, 0], scale: [1, 1.1, 1] },
          transition: { duration: 0.6, repeat: Infinity, repeatDelay: 1 }
        };
      case 'hug':
        return {
          animate: { scale: [1, 1.15, 1.1] },
          transition: { duration: 1.5, ease: 'easeOut' as const }
        };
      case 'breathe':
        return {
          animate: { scale: [1, 1.08, 1] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'sit':
        return {
          animate: { y: [0, 5, 5] },
          transition: { duration: 0.5 }
        };
      case 'tilt':
        return {
          animate: { rotate: [0, 15, 0, -15, 0] },
          transition: { duration: 2, repeat: Infinity, repeatDelay: 1 }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      {...getAnimationProps()}
    >
      <div className="text-8xl md:text-9xl select-none">🧸</div>
      {animation === 'jump' && (
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl"
          animate={{ opacity: [0, 1, 0], y: [-10, -30] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          ✨
        </motion.div>
      )}
      {animation === 'hug' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.4] }}
          transition={{ duration: 1.5 }}
        >
          <div className="text-4xl">🤍</div>
        </motion.div>
      )}
      {animation === 'breathe' && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">•</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export const TeddyMoodCompanion = () => {
  const [input, setInput] = useState('');
  const [mood, setMood] = useState<Mood>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setMood(null);

    setTimeout(() => {
      const detectedMood = analyzeMood(input);
      setMood(detectedMood);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-br from-kawaii-cream/80 to-kawaii-blush/40"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-kawaii-cream/60">
          <span className="text-2xl">🧸</span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Teddy Mood Companion</h2>
          <p className="text-muted-foreground text-sm">Tell me how you're feeling 🤍</p>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I feel... / I'm thinking about... / Today was..."
          className="min-h-[100px] bg-background/60 border-kawaii-blush/30 rounded-2xl resize-none text-base"
        />

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !input.trim()}
          className="kawaii-btn w-full h-12 rounded-2xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold text-lg gap-2"
        >
          <Heart className="w-5 h-5" />
          {isAnalyzing ? 'Teddy is listening...' : 'Share with Teddy 🧸'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex flex-col items-center"
          >
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🧸
            </motion.div>
            <p className="mt-4 text-muted-foreground text-sm">Teddy is feeling your vibes...</p>
          </motion.div>
        )}

        {mood && !isAnalyzing && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex flex-col items-center text-center"
          >
            <TeddyBear animation={moodResponses[mood].animation} />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-lg md:text-xl font-medium text-foreground max-w-sm"
            >
              {moodResponses[mood].message}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 flex gap-2"
            >
              {['🤍', '☁️', '🌷'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-lg opacity-60"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="mt-8 text-xs text-center text-muted-foreground"
      >
        This app is for comfort and fun, not professional support 🤍
      </motion.p>
    </motion.div>
  );
};
