import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ArrowLeft, RotateCcw, Save, LogOut, Volume2, VolumeX, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// Mood emojis with their properties
const moodEmojis = [
  { emoji: '😊', name: 'Happy', color: 'from-yellow-300 to-amber-400', score: 5 },
  { emoji: '🥰', name: 'Loved', color: 'from-pink-300 to-rose-400', score: 5 },
  { emoji: '😌', name: 'Calm', color: 'from-green-300 to-emerald-400', score: 4 },
  { emoji: '🥺', name: 'Soft', color: 'from-blue-200 to-cyan-300', score: 3 },
  { emoji: '😢', name: 'Sad', color: 'from-blue-400 to-indigo-500', score: 2 },
  { emoji: '😤', name: 'Frustrated', color: 'from-orange-400 to-red-500', score: 2 },
  { emoji: '😰', name: 'Anxious', color: 'from-purple-400 to-violet-500', score: 2 },
  { emoji: '😴', name: 'Tired', color: 'from-slate-400 to-gray-500', score: 3 },
  { emoji: '🤔', name: 'Confused', color: 'from-amber-300 to-orange-400', score: 3 },
  { emoji: '✨', name: 'Excited', color: 'from-fuchsia-300 to-pink-400', score: 5 },
];

// Play gentle chime sound
const playChime = (frequency: number = 523.25, duration: number = 0.4) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.log('Audio not supported');
  }
};

const TeddyBottle = ({ 
  filledEmojis, 
  bottleColor 
}: { 
  filledEmojis: typeof moodEmojis;
  bottleColor: string;
}) => {
  const fillLevel = Math.min(filledEmojis.length * 10, 100); // Max 10 emojis = 100%

  return (
    <div className="relative w-48 md:w-64 h-72 md:h-96 mx-auto">
      {/* Bottle outline - teddy bear shape */}
      <svg 
        viewBox="0 0 200 300" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))' }}
      >
        {/* Bottle body - teddy bear silhouette */}
        <defs>
          <clipPath id="bottleClip">
            {/* Ears */}
            <circle cx="50" cy="50" r="30" />
            <circle cx="150" cy="50" r="30" />
            {/* Head */}
            <ellipse cx="100" cy="80" rx="55" ry="50" />
            {/* Body */}
            <ellipse cx="100" cy="180" rx="70" ry="80" />
            {/* Arms */}
            <ellipse cx="25" cy="160" rx="20" ry="35" />
            <ellipse cx="175" cy="160" rx="20" ry="35" />
            {/* Legs */}
            <ellipse cx="60" cy="270" rx="25" ry="30" />
            <ellipse cx="140" cy="270" rx="25" ry="30" />
          </clipPath>

          <linearGradient id="bottleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>

          <linearGradient id={`fillGradient`} x1="0%" y1="100%" x2="0%" y2="0%">
            {filledEmojis.map((emoji, i) => {
              const position = (i / Math.max(filledEmojis.length - 1, 1)) * 100;
              const colors = emoji.color.split(' ');
              const fromColor = colors[0].replace('from-', '');
              return (
                <stop 
                  key={i} 
                  offset={`${position}%`} 
                  className={`text-${fromColor}`}
                  style={{ stopColor: `var(--tw-gradient-${i % 2 === 0 ? 'from' : 'to'})` }}
                />
              );
            })}
          </linearGradient>
        </defs>

        {/* Bottle glass effect */}
        <g clipPath="url(#bottleClip)">
          {/* Background */}
          <rect x="0" y="0" width="200" height="300" fill="url(#bottleGradient)" />
          
          {/* Fill level */}
          <motion.rect 
            x="0" 
            y={300 - (fillLevel * 3)}
            width="200" 
            height={fillLevel * 3}
            initial={{ height: 0, y: 300 }}
            animate={{ 
              height: fillLevel * 3, 
              y: 300 - (fillLevel * 3) 
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`${bottleColor}`}
            style={{
              fill: fillLevel > 0 
                ? `url(#fillGradient)` 
                : 'transparent'
            }}
            opacity={0.7}
          />
          
          {/* Gradient overlay for depth */}
          <rect 
            x="0" 
            y="0" 
            width="200" 
            height="300" 
            fill="url(#bottleGradient)" 
            opacity={0.5}
          />
        </g>

        {/* Bottle outline */}
        <g stroke="hsl(340 30% 80%)" strokeWidth="3" fill="none">
          <circle cx="50" cy="50" r="30" />
          <circle cx="150" cy="50" r="30" />
          <ellipse cx="100" cy="80" rx="55" ry="50" />
          <ellipse cx="100" cy="180" rx="70" ry="80" />
          <ellipse cx="25" cy="160" rx="20" ry="35" />
          <ellipse cx="175" cy="160" rx="20" ry="35" />
          <ellipse cx="60" cy="270" rx="25" ry="30" />
          <ellipse cx="140" cy="270" rx="25" ry="30" />
        </g>

        {/* Teddy face (always visible) */}
        <g>
          {/* Eyes */}
          <circle cx="75" cy="70" r="8" fill="hsl(340 30% 25%)" />
          <circle cx="125" cy="70" r="8" fill="hsl(340 30% 25%)" />
          <circle cx="78" cy="68" r="3" fill="white" />
          <circle cx="128" cy="68" r="3" fill="white" />
          {/* Nose */}
          <ellipse cx="100" cy="90" rx="10" ry="7" fill="hsl(340 30% 35%)" />
          {/* Mouth */}
          <path d="M 90 100 Q 100 110 110 100" stroke="hsl(340 30% 35%)" strokeWidth="2" fill="none" />
        </g>
      </svg>

      {/* Floating emojis inside bottle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {filledEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-3xl"
            initial={{ opacity: 0, y: 100, scale: 0 }}
            animate={{ 
              opacity: 1, 
              y: 150 - (i * 20) - Math.random() * 30,
              x: 70 + Math.sin(i * 1.5) * 30,
              scale: 1,
              rotate: Math.random() * 20 - 10
            }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            {emoji.emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

const MoodStars = ({ score }: { score: number }) => {
  const maxStars = 5;
  const filledStars = Math.round((score / 5) * maxStars);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground font-medium">Mood Level</span>
      <div className="flex gap-1">
        {[...Array(maxStars)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Star 
              className={`w-8 h-8 ${
                i < filledStars 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-muted/40'
              }`}
            />
          </motion.div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {filledStars === 5 ? 'Amazing! ✨' : 
         filledStars >= 4 ? 'Great! 🌟' :
         filledStars >= 3 ? 'Okay 🌸' :
         filledStars >= 2 ? 'Hang in there 💕' :
         'Sending hugs 🤍'}
      </span>
    </div>
  );
};

const MoodBottle = () => {
  const navigate = useNavigate();
  const [filledEmojis, setFilledEmojis] = useState<typeof moodEmojis>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUserId(session.user.id);

      // Check if user completed quiz
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('completed_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!preferences?.completed_at) {
        navigate('/quiz');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const addEmoji = useCallback((emoji: typeof moodEmojis[0]) => {
    if (filledEmojis.length >= 10) {
      toast({
        title: "Bottle is full! 🧸",
        description: "Save your mood or reset to add more feelings"
      });
      return;
    }

    setFilledEmojis(prev => [...prev, emoji]);
    
    if (soundEnabled) {
      // Play ascending chime based on fill level
      const frequency = 400 + (filledEmojis.length * 50);
      playChime(frequency, 0.3);
    }
  }, [filledEmojis.length, soundEnabled]);

  const resetBottle = () => {
    setFilledEmojis([]);
    if (soundEnabled) {
      playChime(300, 0.5);
    }
  };

  const saveMood = async () => {
    if (!userId || filledEmojis.length === 0) return;

    setIsSaving(true);

    try {
      const avgScore = Math.round(
        filledEmojis.reduce((acc, e) => acc + e.score, 0) / filledEmojis.length
      );

      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: userId,
          emojis: filledEmojis.map(e => e.emoji),
          mood_score: avgScore
        });

      if (error) throw error;

      toast({
        title: "Mood saved! 🎀✨",
        description: "Your feelings have been recorded"
      });

      setFilledEmojis([]);

      if (soundEnabled) {
        playChime(523, 0.4);
        setTimeout(() => playChime(659, 0.4), 150);
        setTimeout(() => playChime(784, 0.5), 300);
      }
    } catch (error) {
      toast({
        title: "Oops! 😿",
        description: "Couldn't save your mood. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // Calculate mood score
  const avgScore = filledEmojis.length > 0 
    ? filledEmojis.reduce((acc, e) => acc + e.score, 0) / filledEmojis.length
    : 0;

  // Get bottle color based on predominant mood
  const getBottleColor = () => {
    if (filledEmojis.length === 0) return 'from-kawaii-blush/20 to-kawaii-lavender/20';
    const lastEmoji = filledEmojis[filledEmojis.length - 1];
    return lastEmoji.color;
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
        to="/suggestions"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30 text-foreground hover:bg-kawaii-blush/20 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      {/* Sound & Logout */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30">
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
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Fill Your Mood Bottle 🧸
          </h1>
          <p className="text-muted-foreground">Tap emojis to add your feelings 💕</p>
        </motion.div>

        {/* Main content - 3 column layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-5xl">
          
          {/* Left - Emoji Picker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-3xl p-6 bg-gradient-to-br from-kawaii-cream/60 to-kawaii-blush/40"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
              How are you feeling?
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {moodEmojis.map((emoji) => (
                <motion.button
                  key={emoji.name}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addEmoji(emoji)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-background/60 hover:bg-background/80 transition-colors text-2xl"
                  title={emoji.name}
                >
                  {emoji.emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Center - Teddy Bottle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <TeddyBottle 
              filledEmojis={filledEmojis}
              bottleColor={getBottleColor()}
            />

            {/* Fill indicator */}
            <div className="text-center mt-4">
              <span className="text-sm text-muted-foreground">
                {filledEmojis.length}/10 feelings added
              </span>
            </div>
          </motion.div>

          {/* Right - Mood Stars & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Mood Stars */}
            <AnimatePresence>
              {filledEmojis.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="glass-card rounded-2xl p-6 bg-gradient-to-br from-kawaii-lavender/40 to-kawaii-mint/40"
                >
                  <MoodStars score={avgScore} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={saveMood}
                disabled={filledEmojis.length === 0 || isSaving}
                className="kawaii-btn h-12 rounded-2xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold gap-2"
              >
                {isSaving ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    ✨
                  </motion.span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Mood
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetBottle}
                disabled={filledEmojis.length === 0}
                variant="outline"
                className="h-12 rounded-2xl gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Bottle
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Current feelings display */}
        <AnimatePresence>
          {filledEmojis.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 flex items-center gap-1 flex-wrap justify-center"
            >
              <span className="text-sm text-muted-foreground mr-2">Your feelings:</span>
              {filledEmojis.map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl"
                >
                  {emoji.emoji}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link to original Teddy page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link 
            to="/teddy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            Want a hug from Teddy? 🧸
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-center text-muted-foreground max-w-md"
        >
          Track your emotions and understand your feelings better 💕
        </motion.p>
      </main>
    </div>
  );
};

export default MoodBottle;