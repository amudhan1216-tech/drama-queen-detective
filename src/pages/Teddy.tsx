import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';

type Mood = 'calm' | 'happy' | 'sad' | 'anxious' | 'angry' | 'confused' | null;

const moodKeywords: Record<Exclude<Mood, null>, string[]> = {
  calm: ['okay', 'fine', 'chill', 'relaxed', 'peaceful', 'good', 'alright', 'neutral', 'meh', 'content', 'steady'],
  happy: ['happy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'yay', 'omg', 'best', 'awesome', 'joy', 'fun', 'grateful', 'blessed', 'thrilled'],
  sad: ['sad', 'crying', 'hurt', 'lonely', 'tired', 'exhausted', 'miss', 'broken', 'pain', 'empty', 'numb', 'depressed', 'heartbroken', 'alone', 'hopeless'],
  anxious: ['anxious', 'worried', 'scared', 'overthinking', 'panic', 'nervous', 'stress', 'afraid', 'what if', 'cant stop thinking', 'restless', 'uneasy'],
  angry: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'hate', 'upset', 'furious', 'pissed', 'rage', 'bitter'],
  confused: ['confused', 'unsure', 'idk', 'dont know', "don't know", 'mixed', 'unclear', 'lost', 'weird', 'strange', 'uncertain', 'torn']
};

const moodResponses: Record<Exclude<Mood, null>, { messages: string[]; animation: string }> = {
  calm: {
    messages: [
      "Hi… I'm here with you 🧸🤍",
      "Just sitting here with you 🧸☁️",
      "Peace looks good on you 🧸✨",
      "This quiet moment is yours 🧸🌷",
      "I'm glad you're okay 🧸🤍"
    ],
    animation: 'wave'
  },
  happy: {
    messages: [
      "You sound happy today 🧸✨ I like this energy",
      "Your joy makes me bounce 🧸💫",
      "This is the energy we love 🧸🎀",
      "You're glowing right now 🧸✨",
      "Keep shining, you deserve this 🧸🌟"
    ],
    animation: 'jump'
  },
  sad: {
    messages: [
      "Come here 🧸🤍 You don't have to be okay right now",
      "I'm giving you the biggest hug 🧸💕",
      "It's okay to feel this way. I'm here 🧸🤍",
      "You're not alone in this 🧸☁️",
      "Rest your heart here 🧸🌙",
      "Sometimes tears are just feelings finding their way out 🧸🤍"
    ],
    animation: 'hug'
  },
  anxious: {
    messages: [
      "Let's breathe together 🧸🤍 One step at a time",
      "In… and out… you're doing great 🧸☁️",
      "Your worries are valid, but you're safe right now 🧸🤍",
      "I'll stay here while you breathe 🧸🌷",
      "The storm will pass. I promise 🧸✨",
      "You don't have to figure it all out today 🧸🤍"
    ],
    animation: 'breathe'
  },
  angry: {
    messages: [
      "It's okay to feel this way 🧸🤍 I'm listening",
      "Your feelings are valid 🧸☁️",
      "I'm sitting with you through this 🧸🤍",
      "You don't have to explain. I understand 🧸🌙",
      "Let it out. This is a safe space 🧸🤍"
    ],
    animation: 'sit'
  },
  confused: {
    messages: [
      "It's okay to not have answers yet 🧸🤍",
      "Uncertainty is just a chapter, not the whole story 🧸☁️",
      "You don't need to have it all figured out 🧸✨",
      "Sometimes the path reveals itself slowly 🧸🌷",
      "Being unsure doesn't make you lost 🧸🤍"
    ],
    animation: 'tilt'
  }
};

const comfortingAffirmations = [
  "You are enough, exactly as you are 🤍",
  "Your feelings matter 🌷",
  "It's okay to take things slow ☁️",
  "You're doing better than you think ✨",
  "Rest is productive too 🌙",
  "You deserve softness and care 🎀",
  "Small steps still count 💫",
  "Your presence is a gift 🧸",
  "Be gentle with yourself today 🤍",
  "You're allowed to just exist 🌷"
];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const analyzeMood = (text: string): Exclude<Mood, null> => {
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
  
  return Object.entries(moodScores).find(([_, score]) => score === maxScore)?.[0] as Exclude<Mood, null> || 'calm';
};

const BigTeddyBear = ({ animation, isIdle }: { animation: string; isIdle: boolean }) => {
  if (isIdle) {
    return (
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' as const }}
      >
        {/* Left paw */}
        <motion.div
          className="absolute text-6xl md:text-8xl"
          style={{ left: '-60px', top: '40%' }}
          animate={{ 
            rotate: [0, 15, 0, 15, 0],
            x: [0, 10, 0, 10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          🐾
        </motion.div>
        
        {/* Main teddy */}
        <motion.div
          className="text-[12rem] md:text-[16rem] lg:text-[20rem] select-none"
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, -2, 2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          🧸
        </motion.div>

        {/* Right paw */}
        <motion.div
          className="absolute text-6xl md:text-8xl"
          style={{ right: '-60px', top: '40%' }}
          animate={{ 
            rotate: [0, -15, 0, -15, 0],
            x: [0, -10, 0, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          🐾
        </motion.div>

        {/* Floating hearts */}
        <motion.div
          className="absolute -top-8 text-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🤍
        </motion.div>
      </motion.div>
    );
  }

  const getAnimationProps = () => {
    switch (animation) {
      case 'wave':
        return {
          animate: { rotate: [0, -8, 8, -8, 0] },
          transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 }
        };
      case 'jump':
        return {
          animate: { y: [0, -40, 0], scale: [1, 1.1, 1] },
          transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }
        };
      case 'hug':
        return {
          animate: { scale: [1, 1.15, 1.1] },
          transition: { duration: 2, ease: 'easeOut' as const }
        };
      case 'breathe':
        return {
          animate: { scale: [1, 1.08, 1] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'sit':
        return {
          animate: { y: [0, 10, 10] },
          transition: { duration: 0.8 }
        };
      case 'tilt':
        return {
          animate: { rotate: [0, 12, 0, -12, 0] },
          transition: { duration: 2.5, repeat: Infinity, repeatDelay: 1 }
        };
      default:
        return {};
    }
  };

  const animProps = getAnimationProps();

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Hug animation - arms coming together */}
      {animation === 'hug' && (
        <>
          {/* Left arm */}
          <motion.div
            className="absolute text-7xl md:text-9xl z-10"
            style={{ left: '-20px', top: '35%' }}
            initial={{ rotate: -45, x: -80 }}
            animate={{ rotate: 25, x: 30 }}
            transition={{ duration: 1.5, ease: 'easeOut' as const }}
          >
            🐾
          </motion.div>
          
          {/* Right arm */}
          <motion.div
            className="absolute text-7xl md:text-9xl z-10"
            style={{ right: '-20px', top: '35%' }}
            initial={{ rotate: 45, x: 80 }}
            animate={{ rotate: -25, x: -30 }}
            transition={{ duration: 1.5, ease: 'easeOut' as const }}
          >
            🐾
          </motion.div>

          {/* Hearts burst */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl md:text-4xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: (i - 2) * 60,
                y: -100 - Math.random() * 50
              }}
              transition={{ duration: 2, delay: 0.5 + i * 0.2 }}
            >
              💕
            </motion.div>
          ))}
        </>
      )}

      {/* Main teddy */}
      <motion.div
        className="text-[12rem] md:text-[16rem] lg:text-[20rem] select-none"
        {...animProps}
      >
        🧸
      </motion.div>

      {/* Jump sparkles */}
      {animation === 'jump' && (
        <motion.div
          className="absolute -top-10 text-4xl md:text-6xl"
          animate={{ opacity: [0, 1, 0], y: [-20, -60], scale: [0.5, 1.5, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        >
          ✨
        </motion.div>
      )}

      {/* Breathing indicator */}
      {animation === 'breathe' && (
        <motion.div
          className="absolute -bottom-16 flex gap-3"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-2xl text-muted-foreground">•</span>
          <span className="text-2xl text-muted-foreground">•</span>
          <span className="text-2xl text-muted-foreground">•</span>
        </motion.div>
      )}
    </motion.div>
  );
};

const TeddyPage = () => {
  const [input, setInput] = useState('');
  const [mood, setMood] = useState<Mood>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setMood(null);

    setTimeout(() => {
      const detectedMood = analyzeMood(input);
      setMood(detectedMood);
      setCurrentMessage(getRandomItem(moodResponses[detectedMood].messages));
      setAffirmation(getRandomItem(comfortingAffirmations));
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(30 50% 96%) 0%, hsl(340 40% 94%) 50%, hsl(280 30% 95%) 100%)'
        }}
      />

      <CustomCursor />
      <FloatingHearts />

      {/* Back button */}
      <Link 
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30 text-foreground hover:bg-kawaii-blush/20 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Teddy Mood Companion 🧸
          </h1>
          <p className="text-muted-foreground">Tell me how you're feeling 🤍</p>
        </motion.div>

        {/* Big Teddy */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="text-[10rem] md:text-[14rem]"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🧸
                </motion.div>
                <p className="mt-4 text-lg text-muted-foreground">Teddy is feeling your vibes...</p>
              </motion.div>
            ) : (
              <motion.div
                key="teddy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BigTeddyBear 
                  animation={mood ? moodResponses[mood].animation : ''} 
                  isIdle={!mood} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message display */}
        <AnimatePresence>
          {mood && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mb-8 max-w-md"
            >
              <p className="text-xl md:text-2xl font-medium text-foreground mb-4">
                {currentMessage}
              </p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-kawaii-lavender/30 to-kawaii-mint/30 border border-kawaii-lavender/20"
              >
                <p className="text-sm text-muted-foreground mb-1">A little reminder:</p>
                <p className="text-foreground font-medium">{affirmation}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 flex justify-center gap-2"
              >
                {['🤍', '☁️', '🌷', '✨', '🎀'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-xl opacity-60"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md space-y-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I feel... / I'm thinking about... / Today was..."
            className="min-h-[100px] bg-background/80 backdrop-blur-sm border-kawaii-blush/30 rounded-2xl resize-none text-base"
          />

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !input.trim()}
            className="kawaii-btn w-full h-14 rounded-2xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold text-lg gap-2"
          >
            <Heart className="w-5 h-5" />
            {isAnalyzing ? 'Teddy is listening...' : 'Share with Teddy 🧸'}
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="mt-12 text-xs text-center text-muted-foreground"
        >
          This app is for comfort and fun, not professional support 🤍
        </motion.p>
      </main>
    </div>
  );
};

export default TeddyPage;
