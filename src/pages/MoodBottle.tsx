import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ArrowLeft, Volume2, VolumeX, Star, Sparkles, Heart } from 'lucide-react';
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

const moodQuestions = [
  { question: "How's your heart feeling right now?", emoji: "💗" },
  { question: "Did something make you smile today?", emoji: "😊" },
  { question: "Are you feeling loved and appreciated?", emoji: "🥰" },
  { question: "Is there something weighing on your mind?", emoji: "💭" },
  { question: "How's your energy level today?", emoji: "✨" },
];

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

// Teddy-shaped bottle SVG component
const TeddyBottle = ({ moodScore, fillLevel }: { moodScore: number; fillLevel: number }) => {
  const isHappy = moodScore >= 4;
  const isSad = moodScore <= 2;
  
  // Pastel colors based on mood
  const bodyColor = isHappy ? "hsl(340, 60%, 85%)" : isSad ? "hsl(280, 40%, 88%)" : "hsl(30, 50%, 90%)";
  const cheekColor = isHappy ? "hsl(350, 80%, 80%)" : "hsl(340, 50%, 85%)";
  const fillColor = isHappy 
    ? "linear-gradient(180deg, hsl(340, 70%, 80%) 0%, hsl(50, 80%, 75%) 100%)"
    : isSad 
    ? "linear-gradient(180deg, hsl(280, 50%, 80%) 0%, hsl(220, 60%, 80%) 100%)"
    : "linear-gradient(180deg, hsl(340, 60%, 85%) 0%, hsl(30, 60%, 85%) 100%)";

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
            {/* Teddy bear body shape */}
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
              {/* Happy sparkling eyes */}
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
              {/* Sparkles in eyes */}
              <motion.circle cx="78" cy="78" r="2" fill="white" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
              <motion.circle cx="128" cy="78" r="2" fill="white" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            </>
          ) : (
            <>
              {/* Soft caring eyes */}
              <ellipse cx="75" cy="80" rx="8" ry="10" fill="hsl(0, 0%, 25%)" />
              <ellipse cx="125" cy="80" rx="8" ry="10" fill="hsl(0, 0%, 25%)" />
              <circle cx="77" cy="78" r="3" fill="white" opacity="0.8" />
              <circle cx="127" cy="78" r="3" fill="white" opacity="0.8" />
              {isSad && (
                <>
                  {/* Concerned eyebrows */}
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
            animate={{ height: fillLevel * 1.6, y: 250 - fillLevel * 1.6 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            opacity={0.7}
          />
          {/* Bubbles */}
          {fillLevel > 0 && [...Array(6)].map((_, i) => (
            <motion.circle
              key={i}
              cx={50 + i * 20}
              r={3 + Math.random() * 3}
              fill="rgba(255,255,255,0.5)"
              initial={{ cy: 250 }}
              animate={{ cy: [250, 250 - fillLevel * 1.4], opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </g>
        
        {/* Belly heart */}
        <motion.g 
          transform="translate(100, 175)"
          animate={isHappy ? { scale: [1, 1.15, 1] } : { scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path 
            d="M0 -8 C-6 -16 -18 -14 -18 -4 C-18 6 0 18 0 18 C0 18 18 6 18 -4 C18 -14 6 -16 0 -8" 
            fill="hsl(350, 70%, 75%)"
            stroke="hsl(350, 60%, 65%)"
            strokeWidth="1.5"
          />
        </motion.g>
        
        {/* Little arms */}
        <ellipse cx="30" cy="160" rx="18" ry="25" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" transform="rotate(-20, 30, 160)" />
        <ellipse cx="170" cy="160" rx="18" ry="25" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" transform="rotate(20, 170, 160)" />
        
        {/* Little feet */}
        <ellipse cx="60" cy="245" rx="25" ry="15" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" />
        <ellipse cx="140" cy="245" rx="25" ry="15" fill={bodyColor} stroke="hsl(340, 30%, 75%)" strokeWidth="2" />
        <ellipse cx="60" cy="245" rx="12" ry="8" fill="hsl(340, 50%, 80%)" />
        <ellipse cx="140" cy="245" rx="12" ry="8" fill="hsl(340, 50%, 80%)" />
      </svg>
      
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

// Big magical star rating component
const MagicalStars = ({ rating, onRate }: { rating: number; onRate: (r: number) => void }) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  
  const getMoodLabel = (stars: number) => {
    if (stars <= 1) return { text: "Feeling low... 💔", color: "text-purple-400" };
    if (stars <= 2) return { text: "A bit sad today 🥺", color: "text-blue-400" };
    if (stars === 3) return { text: "Hanging in there 🌸", color: "text-pink-400" };
    if (stars === 4) return { text: "Pretty good! 🌟", color: "text-amber-400" };
    return { text: "So happy! ✨💖", color: "text-yellow-400" };
  };

  const displayRating = hoveredStar !== null ? hoveredStar : rating;
  const moodInfo = getMoodLabel(displayRating);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.h3 
        className="text-lg font-semibold text-foreground/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ✨ How are you feeling? ✨
      </motion.h3>
      
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => onRate(star)}
            whileHover={{ scale: 1.3, y: -8 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <motion.div
              animate={star <= displayRating ? {
                filter: ["drop-shadow(0 0 8px gold)", "drop-shadow(0 0 16px gold)", "drop-shadow(0 0 8px gold)"],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Star 
                className={`w-12 h-12 transition-all duration-300 ${
                  star <= displayRating 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-muted/40'
                }`}
              />
            </motion.div>
            {star <= displayRating && (
              <motion.span
                className="absolute -top-2 -right-2 text-xs"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                ✨
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
      
      <motion.p 
        className={`text-lg font-medium ${moodInfo.color}`}
        key={displayRating}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {moodInfo.text}
      </motion.p>
    </div>
  );
};

// Interactive teddy character at bottom
const InteractiveTeddy = ({ moodScore, onInteract }: { moodScore: number; onInteract: () => void }) => {
  const [isHugging, setIsHugging] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  
  const isHappy = moodScore >= 4;
  const isSad = moodScore <= 2;

  const handleClick = () => {
    setIsHugging(true);
    onInteract();
    
    setTimeout(() => {
      setIsHugging(false);
      setShowMessage(true);
      setMessage(
        isHappy 
          ? happyMessages[Math.floor(Math.random() * happyMessages.length)]
          : comfortingMessages[Math.floor(Math.random() * comfortingMessages.length)]
      );
    }, isHappy ? 1000 : 2000);
  };

  const closeMessage = () => {
    setShowMessage(false);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative cursor-pointer"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isHugging ? { 
          scale: [1, 0.85, 0.9, 1.05, 1],
          rotate: [0, -5, 5, -3, 0]
        } : {}}
        transition={{ duration: isHappy ? 1 : 2 }}
      >
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Mini teddy */}
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
            
            {/* Eyes */}
            {isHappy ? (
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
            ) : (
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
              opacity={isHappy ? 0.9 : 0.5}
              animate={isHappy ? { opacity: [0.6, 0.9, 0.6] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.ellipse 
              cx="70" cy="45" rx="6" ry="4" 
              fill="hsl(350, 70%, 80%)" 
              opacity={isHappy ? 0.9 : 0.5}
              animate={isHappy ? { opacity: [0.6, 0.9, 0.6] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
            
            {/* Nose */}
            <ellipse cx="50" cy="48" rx="4" ry="3" fill="hsl(340, 40%, 65%)" />
            
            {/* Mouth */}
            {isHugging ? (
              <motion.ellipse 
                cx="50" cy="55" rx="6" ry="4" 
                fill="hsl(0, 0%, 20%)"
                initial={{ scaleY: 0.5 }}
                animate={{ scaleY: [0.5, 1.2, 0.5] }}
                transition={{ duration: 0.5, repeat: 3 }}
              />
            ) : isHappy ? (
              <motion.path 
                d="M42 52 Q50 62 58 52" 
                stroke="hsl(0, 0%, 20%)" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
              />
            ) : (
              <path d="M45 55 Q50 58 55 55" stroke="hsl(0, 0%, 25%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}
            
            {/* Body */}
            <ellipse cx="50" cy="75" rx="25" ry="20" fill="hsl(30, 50%, 88%)" stroke="hsl(30, 40%, 75%)" strokeWidth="1.5" />
            
            {/* Arms (hugging animation) */}
            <motion.ellipse 
              cx="22" cy="70" rx="10" ry="14" 
              fill="hsl(30, 50%, 88%)" 
              stroke="hsl(30, 40%, 75%)" 
              strokeWidth="1.5"
              animate={isHugging ? { cx: [22, 35, 22], cy: [70, 65, 70] } : {}}
              transition={{ duration: 1 }}
            />
            <motion.ellipse 
              cx="78" cy="70" rx="10" ry="14" 
              fill="hsl(30, 50%, 88%)" 
              stroke="hsl(30, 40%, 75%)" 
              strokeWidth="1.5"
              animate={isHugging ? { cx: [78, 65, 78], cy: [70, 65, 70] } : {}}
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
          
          {/* Hearts flying out when hugging */}
          {isHugging && [...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              style={{ left: '50%', top: '50%' }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ 
                x: (Math.random() - 0.5) * 100, 
                y: -60 - Math.random() * 40, 
                opacity: [0, 1, 0], 
                scale: [0, 1.2, 0.8] 
              }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
            >
              {isHappy ? "✨" : "💕"}
            </motion.span>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-2">
          {isHugging 
            ? (isHappy ? "Yay! So happy! 💖" : "Sending you love... 💕") 
            : (isHappy ? "Click me! I'm so happy! ✨" : "Click for a comforting hug 🤗")}
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
  const [moodRating, setMoodRating] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      setUserId(session.user.id);
    };
    check();
  }, [navigate]);

  const handleRate = (rating: number) => {
    setMoodRating(rating);
    if (soundEnabled) {
      playChime(300 + rating * 100, 0.3);
    }
  };

  const handleTeddyInteract = () => {
    if (soundEnabled) {
      // Play gentle melody
      playChime(400, 0.3);
      setTimeout(() => playChime(500, 0.3), 200);
      setTimeout(() => playChime(600, 0.4), 400);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestion(prev => (prev + 1) % moodQuestions.length);
  };

  const saveMood = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const moodEmoji = moodRating >= 4 ? ['😊', '✨'] : moodRating <= 2 ? ['🥺', '💕'] : ['🌸', '💭'];
      await supabase.from('mood_entries').insert({ 
        user_id: userId, 
        emojis: moodEmoji, 
        mood_score: moodRating 
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

  const fillLevel = (moodRating / 5) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Soft pastel background */}
      <div className="fixed inset-0 pointer-events-none" style={{ 
        background: moodRating >= 4 
          ? 'radial-gradient(ellipse at top, hsl(50 80% 96%) 0%, hsl(340 50% 94%) 50%, hsl(30 50% 95%) 100%)'
          : moodRating <= 2
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

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Emotional Teddy Bottle 🧸</h1>
          <p className="text-muted-foreground">Your cozy companion for every mood 💕</p>
        </motion.div>

        {/* Question suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 mb-6 bg-gradient-to-r from-kawaii-blush/30 to-kawaii-lavender/30 max-w-md text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Try thinking about this:</p>
          <p className="text-lg font-medium text-foreground flex items-center justify-center gap-2">
            <span>{moodQuestions[currentQuestion].emoji}</span>
            {moodQuestions[currentQuestion].question}
          </p>
          <Button 
            onClick={nextQuestion} 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Try another question →
          </Button>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-5xl">
          {/* Star rating section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl p-8 bg-gradient-to-br from-kawaii-cream/60 to-kawaii-blush/40"
          >
            <MagicalStars rating={moodRating} onRate={handleRate} />
          </motion.div>

          {/* Teddy bottle center */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <TeddyBottle moodScore={moodRating} fillLevel={fillLevel} />
          </motion.div>

          {/* Interactive teddy section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <InteractiveTeddy moodScore={moodRating} onInteract={handleTeddyInteract} />
            
            <Button 
              onClick={saveMood} 
              disabled={isSaving}
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
