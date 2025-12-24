import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ArrowLeft, Volume2, VolumeX, Star, Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const playChime = (freq = 523, dur = 0.4) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
  } catch {}
};

// Emoji categories with mood scores
const emojiCategories = {
  happy: { emojis: ['😊', '🥰', '😄', '🤗', '✨', '💖', '🌟', '🦋'], score: 5 },
  good: { emojis: ['😌', '💕', '🌸', '😇', '💫', '🎀', '🌷'], score: 4 },
  neutral: { emojis: ['😐', '🤔', '💭', '🌙', '☁️', '🍃'], score: 3 },
  sad: { emojis: ['😢', '🥺', '😔', '💔', '🌧️', '😿'], score: 2 },
  angry: { emojis: ['😤', '😠', '💢', '😡', '🔥', '⚡'], score: 1 },
};

const allEmojis = Object.values(emojiCategories).flatMap(c => c.emojis);

const comfortingMessages = [
  "I hope your mood feels lighter now. You are strong, beautiful, and not alone. Take a deep breath, everything will be okay. You deserve love, peace, and happiness. 💕",
  "It's okay to feel what you're feeling. You're doing your best, and that's more than enough. I'm here for you, always. 🤍",
  "Even on hard days, remember: you are worthy of all the love in the world. This too shall pass, sweet one. 🌸",
  "Let it all out. Your feelings are valid. After the storm comes the rainbow, and you deserve all the colors. 💫",
];

const happyMessages = [
  "Your smile makes the world brighter! Keep shining, keep laughing, and never stop being you. Happiness looks beautiful on you! 🌟",
  "You're radiating such beautiful energy today! The universe is lucky to have you spreading this joy. ✨",
  "Look at you, all happy and glowing! Your positivity is contagious. Keep that sparkle going! 💖",
  "What a beautiful mood you're in! You deserve every bit of this happiness. May it stay with you always! 🦋",
];

// Calculate mood score from selected emojis
const calculateMoodScore = (selectedEmojis: string[]): number => {
  if (selectedEmojis.length === 0) return 3;
  
  let totalScore = 0;
  let count = 0;
  
  selectedEmojis.forEach(emoji => {
    for (const category of Object.values(emojiCategories)) {
      if (category.emojis.includes(emoji)) {
        totalScore += category.score;
        count++;
        break;
      }
    }
  });
  
  return count > 0 ? Math.round(totalScore / count) : 3;
};

// Emoji selector grid
const EmojiSelector = ({ selectedEmojis, onToggle }: { selectedEmojis: string[]; onToggle: (emoji: string) => void }) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-center text-muted-foreground">Pick emojis that match your mood:</p>
      <div className="grid grid-cols-6 gap-2">
        {allEmojis.map((emoji) => (
          <motion.button
            key={emoji}
            onClick={() => onToggle(emoji)}
            className={`text-2xl p-2 rounded-xl transition-all ${
              selectedEmojis.includes(emoji)
                ? 'bg-kawaii-blush/50 scale-110 shadow-md'
                : 'bg-background/30 hover:bg-kawaii-blush/20'
            }`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Teddy-shaped bottle with emojis inside
const TeddyBottle = ({ selectedEmojis, moodScore }: { selectedEmojis: string[]; moodScore: number }) => {
  const isHappy = moodScore >= 4;
  const isSad = moodScore <= 2;
  
  const bodyColor = isHappy ? "hsl(340, 60%, 85%)" : isSad ? "hsl(280, 40%, 88%)" : "hsl(30, 50%, 90%)";
  const cheekColor = isHappy ? "hsl(350, 80%, 80%)" : "hsl(340, 50%, 85%)";

  return (
    <div className="relative w-64 h-80 mx-auto">
      <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="teddyFill" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={isHappy ? "hsl(50, 80%, 75%)" : isSad ? "hsl(220, 60%, 80%)" : "hsl(30, 60%, 85%)"} />
            <stop offset="100%" stopColor={isHappy ? "hsl(340, 70%, 80%)" : isSad ? "hsl(280, 50%, 80%)" : "hsl(340, 60%, 85%)"} />
          </linearGradient>
          <filter id="teddyGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <clipPath id="teddyBody">
            <ellipse cx="100" cy="170" rx="70" ry="80" />
          </clipPath>
        </defs>
        
        {/* Teddy ears */}
        <motion.ellipse 
          cx="45" cy="55" rx="28" ry="28" 
          fill={bodyColor}
          stroke="hsl(340, 30%, 75%)" 
          strokeWidth="3"
          animate={{ scale: isHappy ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <ellipse cx="45" cy="55" rx="16" ry="16" fill="hsl(340, 50%, 80%)" />
        
        <motion.ellipse 
          cx="155" cy="55" rx="28" ry="28" 
          fill={bodyColor}
          stroke="hsl(340, 30%, 75%)" 
          strokeWidth="3"
          animate={{ scale: isHappy ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <ellipse cx="155" cy="55" rx="16" ry="16" fill="hsl(340, 50%, 80%)" />
        
        {/* Teddy head */}
        <ellipse cx="100" cy="85" rx="55" ry="50" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="3" />
        
        {/* Eyes */}
        <g>
          {isHappy ? (
            <>
              <motion.ellipse 
                cx="75" cy="80" rx="10" ry="6" 
                fill="hsl(0, 0%, 20%)"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.ellipse 
                cx="125" cy="80" rx="10" ry="6" 
                fill="hsl(0, 0%, 20%)"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.circle cx="78" cy="78" r="2" fill="white" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
              <motion.circle cx="128" cy="78" r="2" fill="white" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            </>
          ) : (
            <>
              <ellipse cx="75" cy="80" rx="8" ry="10" fill="hsl(0, 0%, 25%)" />
              <ellipse cx="125" cy="80" rx="8" ry="10" fill="hsl(0, 0%, 25%)" />
              <circle cx="77" cy="78" r="3" fill="white" opacity="0.8" />
              <circle cx="127" cy="78" r="3" fill="white" opacity="0.8" />
              {isSad && (
                <>
                  <path d="M65 68 Q75 72 85 70" stroke="hsl(0, 0%, 30%)" strokeWidth="2" fill="none" />
                  <path d="M135 68 Q125 72 115 70" stroke="hsl(0, 0%, 30%)" strokeWidth="2" fill="none" />
                </>
              )}
            </>
          )}
        </g>
        
        {/* Blush cheeks */}
        <motion.ellipse 
          cx="55" cy="95" rx="12" ry="8" 
          fill={cheekColor}
          opacity={isHappy ? 0.9 : 0.6}
          animate={isHappy ? { scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.ellipse 
          cx="145" cy="95" rx="12" ry="8" 
          fill={cheekColor}
          opacity={isHappy ? 0.9 : 0.6}
          animate={isHappy ? { scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Nose */}
        <ellipse cx="100" cy="100" rx="8" ry="6" fill="hsl(340, 40%, 70%)" />
        
        {/* Mouth */}
        {isHappy ? (
          <motion.path 
            d="M85 110 Q100 125 115 110" 
            stroke="hsl(340, 30%, 50%)" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"
            animate={{ d: ["M85 110 Q100 125 115 110", "M85 108 Q100 128 115 108", "M85 110 Q100 125 115 110"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : (
          <path 
            d="M90 115 Q100 120 110 115" 
            stroke="hsl(340, 30%, 50%)" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
          />
        )}
        
        {/* Teddy body (bottle part) */}
        <ellipse cx="100" cy="170" rx="70" ry="80" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="3" />
        
        {/* Liquid fill inside body */}
        <g clipPath="url(#teddyBody)">
          <motion.rect
            x="30"
            width="140"
            fill="url(#teddyFill)"
            filter="url(#teddyGlow)"
            initial={{ height: 0, y: 250 }}
            animate={{ height: selectedEmojis.length * 20, y: 250 - selectedEmojis.length * 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            opacity={0.7}
          />
        </g>
        
        {/* Little arms */}
        <ellipse cx="30" cy="160" rx="18" ry="25" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" transform="rotate(-20, 30, 160)" />
        <ellipse cx="170" cy="160" rx="18" ry="25" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" transform="rotate(20, 170, 160)" />
        
        {/* Little feet */}
        <ellipse cx="60" cy="245" rx="25" ry="15" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" />
        <ellipse cx="140" cy="245" rx="25" ry="15" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" />
        <ellipse cx="60" cy="245" rx="12" ry="8" fill="hsl(340, 50%, 80%)" />
        <ellipse cx="140" cy="245" rx="12" ry="8" fill="hsl(340, 50%, 80%)" />
      </svg>
      
      {/* Emojis floating inside the bottle */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-32 h-32 overflow-hidden">
        <AnimatePresence>
          {selectedEmojis.map((emoji, i) => (
            <motion.span
              key={`${emoji}-${i}`}
              className="absolute text-2xl"
              initial={{ y: 100, opacity: 0, scale: 0 }}
              animate={{ 
                y: -10 - (i % 4) * 25, 
                x: -40 + (i % 5) * 20,
                opacity: 1, 
                scale: 1,
                rotate: [0, 10, -10, 0]
              }}
              exit={{ y: -50, opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                rotate: { duration: 3, repeat: Infinity }
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Floating sparkles for happy mood */}
      {isHappy && [...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-xl"
          style={{ left: `${10 + i * 15}%`, top: `${5 + (i % 3) * 20}%` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: [-10, -30, -10] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
        >
          ✨
        </motion.span>
      ))}
    </div>
  );
};

// Magical star rating display (calculated from emojis)
const MagicalStars = ({ rating }: { rating: number }) => {
  const getMoodLabel = (stars: number) => {
    if (stars <= 1) return { text: "Feeling angry... 💢", color: "text-red-400" };
    if (stars <= 2) return { text: "Feeling sad 🥺", color: "text-purple-400" };
    if (stars === 3) return { text: "Hanging in there 🌸", color: "text-pink-400" };
    if (stars === 4) return { text: "Pretty good! 🌟", color: "text-amber-400" };
    return { text: "So happy! ✨💖", color: "text-yellow-400" };
  };

  const moodInfo = getMoodLabel(rating);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.h3 
        className="text-lg font-semibold text-foreground/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ✨ Your Mood Stars ✨
      </motion.h3>
      
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: star * 0.1, type: "spring" }}
          >
            <motion.div
              animate={star <= rating ? {
                filter: ["drop-shadow(0 0 8px gold)", "drop-shadow(0 0 16px gold)", "drop-shadow(0 0 8px gold)"],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Star 
                className={`w-10 h-10 transition-all duration-300 ${
                  star <= rating 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-muted/40'
                }`}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <motion.p 
        className={`text-lg font-medium ${moodInfo.color}`}
        key={rating}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {moodInfo.text}
      </motion.p>
    </div>
  );
};

// Interactive stress-relief teddy (kick/punch when sad, hug when happy)
const StressReliefTeddy = ({ moodScore, soundEnabled }: { moodScore: number; soundEnabled: boolean }) => {
  const [hitCount, setHitCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isComforted, setIsComforted] = useState(false);
  
  const isHappy = moodScore >= 4;
  const needsStressRelief = moodScore <= 3;
  const requiredHits = needsStressRelief ? (4 - moodScore) * 3 + 3 : 1; // More hits needed for lower mood

  const handleInteract = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setHitCount(prev => prev + 1);
    
    if (soundEnabled) {
      if (needsStressRelief && !isComforted) {
        playChime(200, 0.2); // Thump sound
      } else {
        playChime(500, 0.3); // Happy sound
      }
    }

    setTimeout(() => setIsAnimating(false), 300);

    // Check if stress relief is complete
    if (needsStressRelief && hitCount + 1 >= requiredHits && !isComforted) {
      setTimeout(() => {
        setIsComforted(true);
        setShowMessage(true);
        setMessage(comfortingMessages[Math.floor(Math.random() * comfortingMessages.length)]);
        if (soundEnabled) {
          playChime(400, 0.3);
          setTimeout(() => playChime(500, 0.3), 200);
          setTimeout(() => playChime(600, 0.4), 400);
        }
      }, 500);
    } else if (isHappy) {
      setShowMessage(true);
      setMessage(happyMessages[Math.floor(Math.random() * happyMessages.length)]);
    }
  };

  const closeMessage = () => {
    setShowMessage(false);
  };

  const resetTeddy = () => {
    setHitCount(0);
    setIsComforted(false);
    setShowMessage(false);
  };

  // Reset when mood changes
  useEffect(() => {
    resetTeddy();
  }, [moodScore]);

  const getAnimationVariant = () => {
    if (!isAnimating) return {};
    
    if (needsStressRelief && !isComforted) {
      // Being kicked/beaten animation
      return {
        x: [0, -20, 20, -15, 15, -10, 10, 0],
        y: [0, -10, -5, -10, -5, -10, -5, 0],
        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
        scale: [1, 0.9, 1.05, 0.95, 1.02, 0.98, 1, 1],
      };
    }
    
    // Happy hug animation
    return {
      scale: [1, 1.1, 0.95, 1.05, 1],
      rotate: [0, 5, -5, 3, 0],
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress indicator for stress relief */}
      {needsStressRelief && !isComforted && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Release your stress! ({hitCount}/{requiredHits})
          </p>
          <div className="w-40 h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-red-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${(hitCount / requiredHits) * 100}%` }}
            />
          </div>
        </div>
      )}

      <motion.div
        className="relative cursor-pointer select-none"
        onClick={handleInteract}
        animate={getAnimationVariant()}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: isComforted || isHappy ? 1.05 : 1.02 }}
      >
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Mini teddy for interaction */}
            <defs>
              <filter id="miniGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="glow"/>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Ears */}
            <circle cx="25" cy="22" r="12" fill="hsl(30, 50%, 88%)" stroke="hsl(30, 40%, 75%)" strokeWidth="1.5" />
            <circle cx="25" cy="22" r="6" fill="hsl(340, 50%, 85%)" />
            <circle cx="75" cy="22" r="12" fill="hsl(30, 50%, 88%)" stroke="hsl(30, 40%, 75%)" strokeWidth="1.5" />
            <circle cx="75" cy="22" r="6" fill="hsl(340, 50%, 85%)" />
            
            {/* Head */}
            <ellipse cx="50" cy="40" rx="28" ry="25" fill="hsl(30, 50%, 88%)" stroke="hsl(30, 40%, 75%)" strokeWidth="1.5" />
            
            {/* Eyes - change based on state */}
            {isComforted || isHappy ? (
              // Happy/comforted eyes
              <>
                <motion.path 
                  d="M38 38 Q42 32 46 38" 
                  stroke="hsl(0, 0%, 20%)" 
                  strokeWidth="2.5" 
                  fill="none" 
                  strokeLinecap="round"
                  animate={{ d: ["M38 38 Q42 32 46 38", "M38 36 Q42 30 46 36", "M38 38 Q42 32 46 38"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path 
                  d="M54 38 Q58 32 62 38" 
                  stroke="hsl(0, 0%, 20%)" 
                  strokeWidth="2.5" 
                  fill="none" 
                  strokeLinecap="round"
                  animate={{ d: ["M54 38 Q58 32 62 38", "M54 36 Q58 30 62 36", "M54 38 Q58 32 62 38"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </>
            ) : needsStressRelief && isAnimating ? (
              // Squished eyes during hit
              <>
                <path d="M36 38 L48 38" stroke="hsl(0, 0%, 20%)" strokeWidth="3" strokeLinecap="round" />
                <path d="M52 38 L64 38" stroke="hsl(0, 0%, 20%)" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              // Supportive caring eyes
              <>
                <ellipse cx="40" cy="38" rx="4" ry="5" fill="hsl(0, 0%, 20%)" />
                <ellipse cx="60" cy="38" rx="4" ry="5" fill="hsl(0, 0%, 20%)" />
                <circle cx="41" cy="36" r="1.5" fill="white" opacity="0.8" />
                <circle cx="61" cy="36" r="1.5" fill="white" opacity="0.8" />
              </>
            )}
            
            {/* Blush */}
            <motion.ellipse 
              cx="30" cy="45" rx="6" ry="4" 
              fill="hsl(350, 70%, 80%)" 
              opacity={isComforted || isHappy ? 0.9 : 0.5}
              animate={isComforted || isHappy ? { opacity: [0.6, 0.9, 0.6] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.ellipse 
              cx="70" cy="45" rx="6" ry="4" 
              fill="hsl(350, 70%, 80%)" 
              opacity={isComforted || isHappy ? 0.9 : 0.5}
              animate={isComforted || isHappy ? { opacity: [0.6, 0.9, 0.6] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
            
            {/* Nose */}
            <ellipse cx="50" cy="48" rx="4" ry="3" fill="hsl(340, 40%, 65%)" />
            
            {/* Mouth */}
            {isComforted || isHappy ? (
              <motion.path 
                d="M42 52 Q50 62 58 52" 
                stroke="hsl(0, 0%, 20%)" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
              />
            ) : isAnimating ? (
              // Ouch expression
              <ellipse cx="50" cy="54" rx="5" ry="4" fill="hsl(0, 0%, 25%)" />
            ) : (
              <path d="M45 55 Q50 58 55 55" stroke="hsl(0, 0%, 25%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}
            
            {/* Body */}
            <ellipse cx="50" cy="75" rx="25" ry="20" fill="hsl(30, 50%, 88%)" stroke="hsl(30, 40%, 75%)" strokeWidth="1.5" />
            
            {/* Arms */}
            <motion.ellipse 
              cx="22" cy="70" rx="10" ry="14" 
              fill="hsl(30, 50%, 88%)" 
              stroke="hsl(30, 40%, 75%)" 
              strokeWidth="1.5"
              animate={isComforted ? { cx: [22, 35, 22], cy: [70, 65, 70] } : {}}
              transition={{ duration: 1 }}
            />
            <motion.ellipse 
              cx="78" cy="70" rx="10" ry="14" 
              fill="hsl(30, 50%, 88%)" 
              stroke="hsl(30, 40%, 75%)" 
              strokeWidth="1.5"
              animate={isComforted ? { cx: [78, 65, 78], cy: [70, 65, 70] } : {}}
              transition={{ duration: 1 }}
            />
            
            {/* Belly heart */}
            <motion.path 
              d="M50 70 C47 65 40 66 40 72 C40 78 50 85 50 85 C50 85 60 78 60 72 C60 66 53 65 50 70" 
              fill="hsl(350, 70%, 80%)"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ transformOrigin: "50px 75px" }}
            />
          </svg>
          
          {/* Hit effects */}
          {isAnimating && needsStressRelief && !isComforted && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-xl"
                  style={{ left: '50%', top: '50%' }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 80, 
                    y: -40 - Math.random() * 30, 
                    opacity: [0, 1, 0], 
                    scale: [0, 1.3, 0.8] 
                  }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  {['💥', '✊', '💢', '⚡', '💪'][i]}
                </motion.span>
              ))}
            </>
          )}
          
          {/* Hearts when comforted or happy */}
          {(isComforted || isHappy) && [...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              style={{ left: '50%', top: '30%' }}
              animate={{ 
                y: [-10, -40, -10], 
                x: (i - 1) * 20,
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              💕
            </motion.span>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-2">
          {isComforted ? "Teddy is smiling warmly at you 🥰" :
           isHappy ? "Click for a happy message! ✨" :
           needsStressRelief ? "Click to kick/punch and release stress! 💪" :
           "Click to interact 🧸"}
        </p>
      </motion.div>

      {/* Message modal */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={closeMessage}
          >
            <motion.div 
              className={`max-w-md p-8 rounded-3xl ${
                isHappy 
                  ? 'bg-gradient-to-br from-yellow-100 to-pink-100' 
                  : 'bg-gradient-to-br from-purple-100 to-blue-100'
              } shadow-2xl`}
              onClick={e => e.stopPropagation()}
              initial={{ rotate: -3 }}
              animate={{ rotate: [0, 1, -1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isHappy ? "🧸✨" : "🧸💕"}
                </motion.div>
                <p className="text-lg leading-relaxed text-gray-700 font-medium">
                  {message}
                </p>
                <motion.button
                  onClick={closeMessage}
                  className="mt-6 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-gray-700 font-semibold shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isHappy ? "Thank you! ✨" : "Thank you 💕"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MoodBottle = () => {
  const navigate = useNavigate();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const moodScore = calculateMoodScore(selectedEmojis);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      setUserId(session.user.id);
    };
    check();
  }, [navigate]);

  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
    if (soundEnabled) {
      playChime(400 + Math.random() * 200, 0.2);
    }
  };

  const saveMood = async () => {
    if (!userId || selectedEmojis.length === 0) {
      toast({ title: "Please select some emojis first! 🧸", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await supabase.from('mood_entries').insert({ 
        user_id: userId, 
        emojis: selectedEmojis, 
        mood_score: moodScore 
      });
      toast({ title: "Mood saved! 🧸💕", description: "Your teddy remembers how you feel today." });
      if (soundEnabled) {
        playChime(523, 0.4);
        setTimeout(() => playChime(659, 0.4), 150);
        setTimeout(() => playChime(784, 0.5), 300);
      }
    } catch {
      toast({ title: "Oops! 😿", variant: "destructive" });
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Soft pastel background */}
      <div className="fixed inset-0 pointer-events-none" style={{ 
        background: moodScore >= 4 
          ? 'radial-gradient(ellipse at top, hsl(50 80% 96%) 0%, hsl(340 50% 94%) 50%, hsl(30 50% 95%) 100%)'
          : moodScore <= 2
          ? 'radial-gradient(ellipse at top, hsl(280 40% 96%) 0%, hsl(220 50% 94%) 50%, hsl(280 30% 95%) 100%)'
          : 'radial-gradient(ellipse at top, hsl(340 50% 96%) 0%, hsl(30 40% 94%) 50%, hsl(280 30% 95%) 100%)'
      }} />
      
      <CustomCursor />
      <FloatingHearts />
      
      {/* Back button */}
      <Link 
        to="/home" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30 text-foreground hover:bg-kawaii-blush/20 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </Link>
      
      {/* Sound toggle */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30">
        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
        <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} className="data-[state=checked]:bg-kawaii-blush" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center px-4 py-20">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Emotional Teddy Bottle 🧸</h1>
          <p className="text-muted-foreground">Fill me with your feelings and let me comfort you 💕</p>
        </motion.div>

        {/* Emoji selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 mb-6 bg-gradient-to-r from-kawaii-blush/30 to-kawaii-lavender/30 max-w-sm"
        >
          <EmojiSelector selectedEmojis={selectedEmojis} onToggle={toggleEmoji} />
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full max-w-5xl">
          {/* Star rating display (calculated) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl p-6 bg-gradient-to-br from-kawaii-cream/60 to-kawaii-blush/40"
          >
            <MagicalStars rating={moodScore} />
          </motion.div>

          {/* Teddy bottle center with emojis inside */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <TeddyBottle selectedEmojis={selectedEmojis} moodScore={moodScore} />
          </motion.div>

          {/* Interactive stress-relief teddy */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <StressReliefTeddy moodScore={moodScore} soundEnabled={soundEnabled} />
            
            <Button 
              onClick={saveMood} 
              disabled={isSaving || selectedEmojis.length === 0}
              className="kawaii-btn h-12 px-8 rounded-2xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold gap-2"
            >
              {isSaving ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>✨</motion.span>
              ) : (
                <>
                  <Heart className="w-4 h-4" /> Save My Mood
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MoodBottle;
