import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, ArrowLeft, Volume2, VolumeX, Instagram, Search } from 'lucide-react';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { Switch } from '@/components/ui/switch';

type Mood = 'calm' | 'happy' | 'sad' | 'anxious' | 'angry' | 'confused' | null;

// Gentle chime sound using Web Audio API
const playChime = (frequency: number = 523.25, duration: number = 0.4) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for the main tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    // Gentle fade in and out
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    // Add a soft harmonic
    const harmonic = audioContext.createOscillator();
    const harmonicGain = audioContext.createGain();
    harmonic.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
    harmonic.frequency.value = frequency * 2;
    harmonic.type = 'sine';
    harmonicGain.gain.setValueAtTime(0, audioContext.currentTime);
    harmonicGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.05);
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration * 0.8);
    harmonic.start(audioContext.currentTime);
    harmonic.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.log('Audio not supported');
  }
};

const playHugSound = () => {
  // Play a gentle ascending chord
  playChime(392, 0.5); // G
  setTimeout(() => playChime(494, 0.5), 100); // B
  setTimeout(() => playChime(587, 0.6), 200); // D
  setTimeout(() => playChime(784, 0.8), 350); // High G
};

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

// Boy analyzer data (for fun only!)
const boyMindsets = [
  "Emotionally unavailable but posts deep quotes 🌙",
  "Thinks he's mysterious but everyone knows his moves 🕵️",
  "Will ghost you then ask 'wyd' at 2am 👻",
  "Has commitment issues but wants you to commit 🎭",
  "Says 'I'm not like other guys' (he is exactly like other guys) 🚩",
  "Hot and cold specialist - confusing but intentional ❄️🔥",
  "Posts gym pics but skips emotional accountability day 💪",
  "Replies in 3 days but expects instant responses 📱",
  "Deep conversations at 3am, stranger by morning ☀️",
  "His Spotify is sad boy hours 24/7 🎧"
];

const boyWithGirls = [
  "Will make you feel special... until someone newer shows up 🌸",
  "Good at texting, bad at actually showing up 📵",
  "Gives breadcrumbs and calls it a whole loaf 🍞",
  "Says 'you're different' to everyone 💔",
  "Will remember your birthday but forget to text back 🎂",
  "Makes plans then 'something came up' 🙄",
  "Sweet in private, acts single in public 🎭",
  "Compliments your pics but never your mind 🧠",
  "Will introduce you as 'friend' after 3 months 👀",
  "Talks about his ex 'just as friends' 🚨"
];

const boyRedFlags = [
  "Has 'no drama' in bio (is the drama) 🚩",
  "Following 2000 girls 'for the aesthetic' 👁️",
  "Last post: mirror selfie with cryptic caption 🪞",
  "Stories: gym, car, repeat 🔄",
  "Bio says 'king' (unconfirmed) 👑",
  "Highlights: 'memories' from situationships 📸",
  "Uses 🤷‍♂️ as personality 🤷‍♂️",
  "Profile says 'just vibing' (chaotically) 🌀",
  "Follower ratio: concerning 📊",
  "Reposts relationship memes but can't commit 💀"
];

const boyVerdicts = [
  "Run bestie. Just run. 🏃‍♀️",
  "He's a lesson, not a blessing 📚",
  "Block button exists for a reason 🔒",
  "You deserve better (literally anyone else) ✨",
  "This is not your person, babes 🙅‍♀️",
  "Red flags are not a color palette 🚩",
  "He's someone else's problem now 💅",
  "The streets are calling his name 🛤️",
  "Proceed with extreme caution ⚠️",
  "Next! 👋"
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

const BigTeddyBear = ({ 
  animation, 
  isIdle, 
  isHugging, 
  onTeddyClick,
  soundEnabled 
}: { 
  animation: string; 
  isIdle: boolean; 
  isHugging: boolean;
  onTeddyClick: () => void;
  soundEnabled: boolean;
}) => {
  // Hugging state (clicked)
  if (isHugging) {
    return (
      <motion.div
        className="relative flex items-center justify-center cursor-pointer"
        onClick={onTeddyClick}
      >
        {/* Left arm - wrapping around */}
        <motion.div
          className="absolute text-6xl md:text-8xl lg:text-9xl emoji z-10"
          style={{ 
            left: '0px', 
            top: '35%',
            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
          }}
          initial={{ rotate: -45, x: -100 }}
          animate={{ rotate: 30, x: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
        >
          🤚
        </motion.div>
        
        {/* Main teddy - growing bigger for hug */}
        <motion.div
          className="text-[10rem] md:text-[14rem] lg:text-[18rem] select-none emoji"
          style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1.15] }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
        >
          🧸
        </motion.div>

        {/* Right arm - wrapping around */}
        <motion.div
          className="absolute text-6xl md:text-8xl lg:text-9xl emoji z-10"
          style={{ 
            right: '0px', 
            top: '35%',
            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
          }}
          initial={{ rotate: 45, x: 100 }}
          animate={{ rotate: -30, x: -50 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
        >
          🤚
        </motion.div>

        {/* Hearts burst on hug */}
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl md:text-4xl emoji"
            style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: Math.cos((i / 8) * Math.PI * 2) * 150,
              y: Math.sin((i / 8) * Math.PI * 2) * 150 - 50
            }}
            transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' as const }}
          >
            {['💕', '🤍', '✨', '💗', '☁️', '🌷', '💫', '🎀'][i]}
          </motion.span>
        ))}

        {/* Hug message */}
        <motion.div
          className="absolute -top-20 md:-top-24 px-8 py-4 rounded-full bg-kawaii-blush/90 backdrop-blur-sm border border-white/50 shadow-xl"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-xl md:text-2xl font-bold text-foreground">*hugs you tight* 🤍</span>
        </motion.div>
      </motion.div>
    );
  }

  if (isIdle) {
    return (
      <motion.div
        className="relative flex items-center justify-center cursor-pointer"
        initial={{ opacity: 0, scale: 0.3, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' as const }}
        onClick={onTeddyClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Left arm - open wide for hug */}
        <motion.div
          className="absolute text-6xl md:text-8xl lg:text-9xl emoji"
          style={{ 
            left: '-100px', 
            top: '30%',
            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
          }}
          initial={{ rotate: 0, x: 0 }}
          animate={{ 
            rotate: [-45, -50, -45],
            x: [-20, -30, -20],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' as const,
            delay: 0.5
          }}
        >
          🤚
        </motion.div>
        
        {/* Main teddy - bouncing invitingly */}
        <motion.div
          className="text-[10rem] md:text-[14rem] lg:text-[18rem] select-none emoji"
          style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}
          initial={{ scale: 0.5 }}
          animate={{ 
            scale: [1, 1.05, 1],
            y: [0, -15, 0],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: 'easeInOut' as const 
          }}
        >
          🧸
        </motion.div>

        {/* Right arm - open wide for hug */}
        <motion.div
          className="absolute text-6xl md:text-8xl lg:text-9xl emoji"
          style={{ 
            right: '-100px', 
            top: '30%',
            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
          }}
          initial={{ rotate: 0, x: 0 }}
          animate={{ 
            rotate: [45, 50, 45],
            x: [20, 30, 20],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' as const,
            delay: 0.5
          }}
        >
          🤚
        </motion.div>

        {/* "Hug me" text bubble */}
        <motion.div
          className="absolute -top-16 md:-top-20 px-6 py-3 rounded-full bg-kawaii-blush/80 backdrop-blur-sm border border-white/40 shadow-lg"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: [0, -8, 0], 
            scale: 1 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 1
          }}
        >
          <span className="text-lg md:text-xl font-semibold text-foreground">Click to hug me 🤍</span>
        </motion.div>

        {/* Floating hearts around teddy */}
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-3xl emoji"
            style={{ 
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 20}%`,
              fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              y: [0, -40, -80]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut' as const
            }}
          >
            {['🤍', '✨', '💕', '☁️', '🌷'][i]}
          </motion.span>
        ))}

        {/* Sparkle effects */}
        <motion.span
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-4xl emoji"
          style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ✨
        </motion.span>
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
  const [isHugging, setIsHugging] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const hugTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTeddyClick = useCallback(() => {
    if (isHugging) return;
    
    setIsHugging(true);
    
    if (soundEnabled) {
      playHugSound();
    }
    
    // Reset after hug animation
    if (hugTimeoutRef.current) clearTimeout(hugTimeoutRef.current);
    hugTimeoutRef.current = setTimeout(() => {
      setIsHugging(false);
    }, 3000);
  }, [isHugging, soundEnabled]);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setMood(null);
    setIsHugging(false);

    if (soundEnabled) {
      playChime(440, 0.3);
    }

    setTimeout(() => {
      const detectedMood = analyzeMood(input);
      setMood(detectedMood);
      setCurrentMessage(getRandomItem(moodResponses[detectedMood].messages));
      setAffirmation(getRandomItem(comfortingAffirmations));
      setIsAnalyzing(false);
      
      if (soundEnabled) {
        // Play different chimes based on mood
        if (detectedMood === 'happy') {
          playChime(523, 0.4);
          setTimeout(() => playChime(659, 0.4), 150);
          setTimeout(() => playChime(784, 0.5), 300);
        } else if (detectedMood === 'sad') {
          playHugSound();
        } else {
          playChime(523, 0.5);
        }
      }
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

      {/* Sound toggle */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30">
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-foreground" />
        ) : (
          <VolumeX className="w-4 h-4 text-muted-foreground" />
        )}
        <Switch 
          checked={soundEnabled} 
          onCheckedChange={setSoundEnabled}
          className="data-[state=checked]:bg-kawaii-blush"
        />
        <span className="text-xs text-muted-foreground hidden sm:inline">Sound</span>
      </div>

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
                  isHugging={isHugging}
                  onTeddyClick={handleTeddyClick}
                  soundEnabled={soundEnabled}
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

        {/* Boy Analyzer Section */}
        <BoyAnalyzer soundEnabled={soundEnabled} />

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="mt-12 text-xs text-center text-muted-foreground max-w-md"
        >
          This app is for comfort and fun, not professional support 🤍<br />
          Boy analyzer is 100% fake and for entertainment only!
        </motion.p>
      </main>
    </div>
  );
};

// Boy Analyzer Component
const BoyAnalyzer = ({ soundEnabled }: { soundEnabled: boolean }) => {
  const [instagramId, setInstagramId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    mindset: string;
    withGirls: string;
    redFlag: string;
    verdict: string;
    dangerLevel: number;
  } | null>(null);

  const analyzeProfile = () => {
    if (!instagramId.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    if (soundEnabled) {
      playChime(440, 0.3);
    }

    setTimeout(() => {
      setResult({
        mindset: getRandomItem(boyMindsets),
        withGirls: getRandomItem(boyWithGirls),
        redFlag: getRandomItem(boyRedFlags),
        verdict: getRandomItem(boyVerdicts),
        dangerLevel: Math.floor(Math.random() * 40) + 60, // Always high for drama 60-100%
      });
      setIsAnalyzing(false);

      if (soundEnabled) {
        // Warning sound
        playChime(330, 0.3);
        setTimeout(() => playChime(294, 0.4), 200);
      }
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-md mt-16"
    >
      <div className="glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-br from-kawaii-lavender/30 to-kawaii-blush/30 border border-kawaii-lavender/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-400/40 to-pink-400/40">
            <Instagram className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Boy Analyzer 🔍</h2>
            <p className="text-muted-foreground text-sm">Enter his IG, we'll expose the vibes</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            <Input
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              placeholder="his_instagram_id"
              className="pl-8 h-12 bg-background/60 border-kawaii-lavender/30 rounded-2xl text-base"
            />
          </div>

          <Button
            onClick={analyzeProfile}
            disabled={isAnalyzing || !instagramId.trim()}
            className="kawaii-btn w-full h-12 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold text-lg gap-2"
          >
            <Search className="w-5 h-5" />
            {isAnalyzing ? 'Investigating... 🕵️‍♀️' : 'Analyze This Boy 🔮'}
          </Button>
        </div>

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex flex-col items-center"
            >
              <motion.div
                className="text-5xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                🔍
              </motion.div>
              <p className="mt-3 text-sm text-muted-foreground text-center">
                Scanning red flags...<br />
                <span className="text-xs">Checking emotional availability...</span>
              </p>
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-4"
            >
              {/* Danger Level */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-muted-foreground">🚨 Red Flag Level</span>
                  <span className="text-2xl font-bold text-red-400">{result.dangerLevel}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.dangerLevel}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                  />
                </div>
              </div>

              {/* Analysis Results */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-background/50 border border-kawaii-lavender/20">
                  <p className="text-xs text-muted-foreground mb-1">🧠 His Mindset</p>
                  <p className="text-sm font-medium text-foreground">{result.mindset}</p>
                </div>

                <div className="p-3 rounded-xl bg-background/50 border border-kawaii-blush/20">
                  <p className="text-xs text-muted-foreground mb-1">💕 How He Is With Girls</p>
                  <p className="text-sm font-medium text-foreground">{result.withGirls}</p>
                </div>

                <div className="p-3 rounded-xl bg-background/50 border border-red-400/20">
                  <p className="text-xs text-muted-foreground mb-1">🚩 Red Flag Detected</p>
                  <p className="text-sm font-medium text-foreground">{result.redFlag}</p>
                </div>
              </div>

              {/* Verdict */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-kawaii-blush/50 to-kawaii-lavender/50 border border-white/30 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">✨ Teddy's Verdict ✨</p>
                <p className="text-lg font-bold text-foreground">{result.verdict}</p>
              </motion.div>

              {/* Floating warning emojis */}
              <div className="flex justify-center gap-2 pt-2">
                {['🚩', '👀', '💀', '🏃‍♀️', '⚠️'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-[10px] text-center text-muted-foreground/60">
          *This is 100% fake and for fun only. We don't actually analyze Instagram profiles!
        </p>
      </div>
    </motion.div>
  );
};

export default TeddyPage;
