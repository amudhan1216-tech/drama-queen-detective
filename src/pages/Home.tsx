import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { 
  ArrowLeft, RotateCcw, Save, LogOut, Volume2, VolumeX, Star, 
  Heart, Coffee, Film, Music, ShoppingBag, Palette, Instagram, Search, Sparkles
} from 'lucide-react';

// ============ MOOD BOTTLE SECTION ============
const moodEmojis = [
  { emoji: '😊', name: 'Happy', color: '#FFD93D', score: 5 },
  { emoji: '🥰', name: 'Loved', color: '#FF6B9D', score: 5 },
  { emoji: '😌', name: 'Calm', color: '#6BCB77', score: 4 },
  { emoji: '🥺', name: 'Soft', color: '#93C5FD', score: 3 },
  { emoji: '😢', name: 'Sad', color: '#60A5FA', score: 2 },
  { emoji: '😤', name: 'Frustrated', color: '#F87171', score: 2 },
  { emoji: '😰', name: 'Anxious', color: '#A78BFA', score: 2 },
  { emoji: '😴', name: 'Tired', color: '#94A3B8', score: 3 },
  { emoji: '🤔', name: 'Confused', color: '#FBBF24', score: 3 },
  { emoji: '✨', name: 'Excited', color: '#F472B6', score: 5 },
];

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

// Cute Mason Jar Bottle
const CuteBottle = ({ filledEmojis }: { filledEmojis: typeof moodEmojis }) => {
  const fillPercent = (filledEmojis.length / 5) * 100;
  
  // Get gradient colors from emojis
  const getGradient = () => {
    if (filledEmojis.length === 0) return '#FFE4EC';
    const colors = filledEmojis.map(e => e.color);
    if (colors.length === 1) return colors[0];
    return `linear-gradient(180deg, ${colors.join(', ')})`;
  };

  return (
    <div className="relative w-36 h-52 mx-auto">
      {/* Jar SVG */}
      <svg viewBox="0 0 100 150" className="w-full h-full">
        <defs>
          <clipPath id="jarClip">
            {/* Jar body */}
            <path d="M15 35 Q15 45 20 50 L20 130 Q20 140 35 140 L65 140 Q80 140 80 130 L80 50 Q85 45 85 35 L85 30 Q85 25 80 25 L20 25 Q15 25 15 30 Z" />
          </clipPath>
          <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            {filledEmojis.map((emoji, i) => (
              <stop 
                key={i} 
                offset={`${(i / Math.max(filledEmojis.length - 1, 1)) * 100}%`} 
                stopColor={emoji.color}
                stopOpacity="0.7"
              />
            ))}
          </linearGradient>
        </defs>

        {/* Glass effect background */}
        <g clipPath="url(#jarClip)">
          <rect x="0" y="0" width="100" height="150" fill="rgba(255,255,255,0.3)" />
          
          {/* Fill */}
          <motion.rect 
            x="15" 
            y={140 - (fillPercent * 1.1)}
            width="70" 
            height={fillPercent * 1.1}
            initial={{ height: 0, y: 140 }}
            animate={{ 
              height: fillPercent * 1.1, 
              y: 140 - (fillPercent * 1.1)
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            fill="url(#fillGradient)"
          />
        </g>

        {/* Jar outline */}
        <path 
          d="M15 35 Q15 45 20 50 L20 130 Q20 140 35 140 L65 140 Q80 140 80 130 L80 50 Q85 45 85 35 L85 30 Q85 25 80 25 L20 25 Q15 25 15 30 Z" 
          fill="none" 
          stroke="hsl(340 30% 75%)" 
          strokeWidth="3"
        />

        {/* Lid */}
        <rect x="18" y="15" width="64" height="12" rx="3" fill="hsl(340 40% 85%)" stroke="hsl(340 30% 70%)" strokeWidth="2" />
        
        {/* Lid handle */}
        <ellipse cx="50" cy="12" rx="12" ry="5" fill="none" stroke="hsl(340 30% 70%)" strokeWidth="2" />

        {/* Cute bow */}
        <g transform="translate(50, 28)">
          <ellipse cx="-8" cy="0" rx="6" ry="4" fill="hsl(340 70% 75%)" />
          <ellipse cx="8" cy="0" rx="6" ry="4" fill="hsl(340 70% 75%)" />
          <circle cx="0" cy="0" r="3" fill="hsl(340 80% 65%)" />
        </g>

        {/* Glass shine */}
        <path d="M25 50 L25 120" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {/* Floating emojis inside */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {filledEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-xl"
            initial={{ opacity: 0, y: 50, scale: 0 }}
            animate={{ 
              opacity: 1, 
              y: 100 - (i * 18) - 10,
              x: 40 + Math.sin(i * 2) * 15,
              scale: 1,
              rotate: Math.random() * 30 - 15
            }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {emoji.emoji}
          </motion.span>
        ))}
      </div>

      {/* Sparkle effect when full */}
      {filledEmojis.length === 5 && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-sm"
              style={{ left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 20}%` }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              ✨
            </motion.span>
          ))}
        </>
      )}
    </div>
  );
};

const MoodStars = ({ score }: { score: number }) => {
  const maxStars = 5;
  const filledStars = Math.round((score / 5) * maxStars);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground font-medium">Mood</span>
      <div className="flex gap-0.5">
        {[...Array(maxStars)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Star 
              className={`w-5 h-5 ${
                i < filledStars 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-muted/30'
              }`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============ SUGGESTIONS SECTION ============
interface Suggestion {
  category: string;
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: string;
}

const getSuggestions = (preferences: any): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  const selfCareByColor: Record<string, string[]> = {
    pink: ['Rose bath bombs 🛁', 'Pink face masks 🌸', 'Berry lip balm 💋'],
    lavender: ['Lavender spray 😴', 'Aromatherapy 🪻', 'Purple clips 💜'],
    mint: ['Green tea care 🍵', 'Eucalyptus 🌿', 'Jade roller 💎'],
    peach: ['Vitamin C ✨', 'Peach butter 🍑', 'Coral nails 💅'],
    sky_blue: ['Ocean sounds 🌊', 'Blue glasses 👓', 'Cloud vibes ☁️'],
    cream: ['Vanilla candle 🕯️', 'Cozy blanket 🧸', 'Honey milk 🍯'],
  };

  suggestions.push({
    category: 'Self-Care',
    icon: <Heart className="w-4 h-4" />,
    title: 'Pamper Time 💆‍♀️',
    items: selfCareByColor[preferences?.favorite_color] || selfCareByColor.pink,
    color: 'from-pink-400/20 to-rose-400/20'
  });

  const dateIdeas: Record<string, string[]> = {
    spring: ['Flower picnic 🌷', 'Farmers market 🍓', 'Paint outdoors 🎨'],
    summer: ['Beach sunset 🌅', 'Ice cream 🍦', 'Stargazing ✨'],
    autumn: ['Café hopping ☕', 'Pumpkin patch 🎃', 'Cozy walk 🍂'],
    winter: ['Hot chocolate 🍫', 'Ice skating 🎿', 'Movie night 🎬'],
  };

  suggestions.push({
    category: 'Date Ideas',
    icon: <Coffee className="w-4 h-4" />,
    title: 'Date Vibes 💕',
    items: dateIdeas[preferences?.favorite_season] || dateIdeas.spring,
    color: 'from-orange-400/20 to-amber-400/20'
  });

  const movieRecs: Record<string, string[]> = {
    romcom: ['The Proposal 💍', 'Crazy Rich Asians 💎', '10 Things 💕'],
    fantasy: ["Howl's Castle 🏰", 'Shape of Water 🧜‍♀️', 'Labyrinth 🧚'],
    drama: ['Pride & Prejudice 📚', 'Little Women 👯‍♀️', 'La La Land 🌃'],
    horror: ['Midsommar 🌸', 'The Craft 🔮', "Jennifer's Body 💅"],
    animation: ['Spirited Away 🌊', 'Your Name ⭐', 'Encanto 🦋'],
    kdrama: ['Crash Landing 💕', 'Goblin 👻', 'Reply 1988 📺'],
  };

  suggestions.push({
    category: 'Watch',
    icon: <Film className="w-4 h-4" />,
    title: 'Movie Night 🎬',
    items: movieRecs[preferences?.favorite_movie_genre] || movieRecs.romcom,
    color: 'from-purple-400/20 to-violet-400/20'
  });

  const musicRecs: Record<string, string[]> = {
    pop: ['Ariana Grande 💅', 'Dua Lipa 🪩', 'Olivia Rodrigo 💔'],
    indie: ['Clairo 🌙', 'Girl in Red 🍂', 'Phoebe Bridgers 🌧️'],
    kpop: ['BLACKPINK 💖', 'NewJeans 🎀', 'aespa ✨'],
    lofi: ['Coffee Shop ☕', 'Study Vibes 📚', 'Rainy Lo-Fi 🌧️'],
    rnb: ['SZA 💕', 'Summer Walker 🎮', 'Jhené Aiko 🍃'],
    classical: ['Debussy 🌙', 'Chopin 🌸', 'Tchaikovsky 🦢'],
  };

  suggestions.push({
    category: 'Music',
    icon: <Music className="w-4 h-4" />,
    title: 'Your Vibe 🎧',
    items: musicRecs[preferences?.favorite_music] || musicRecs.pop,
    color: 'from-cyan-400/20 to-blue-400/20'
  });

  const shoppingRecs: Record<string, string[]> = {
    pink: ['Pink cardigan 🌸', 'Heart shades 💕', 'Berry tote 🍓'],
    lavender: ['Butterfly clips 🦋', 'Lilac dress 💜', 'Amethyst 💎'],
    mint: ['Sage scrunchies 🌿', 'Matcha bottle 🍵', 'Eucalyptus 🕯️'],
    peach: ['Peachy blush 🍑', 'Coral dress 🌺', 'Apricot scent 🧴'],
    sky_blue: ['Cloud case ☁️', 'Denim jacket 👖', 'Blue earrings 🦋'],
    cream: ['Beige sweater 🧸', 'Vanilla gloss 💋', 'Neutral decor 🪴'],
  };

  suggestions.push({
    category: 'Shopping',
    icon: <ShoppingBag className="w-4 h-4" />,
    title: 'Treat Yourself 🛍️',
    items: shoppingRecs[preferences?.favorite_color] || shoppingRecs.pink,
    color: 'from-rose-400/20 to-pink-400/20'
  });

  const moodActivities: string[] = ['Solo journal ✍️', 'Dance party 💃', 'Pinterest 📌'];
  
  suggestions.push({
    category: 'Activities',
    icon: <Palette className="w-4 h-4" />,
    title: 'Mood Boost 🌈',
    items: moodActivities,
    color: 'from-emerald-400/20 to-teal-400/20'
  });

  return suggestions;
};

// ============ BOY ANALYZER ============
const boyMindsets = [
  "Emotionally unavailable 🌙",
  "Posts deep quotes 🕵️",
  "Ghosts then texts 2am 👻",
  "Hot and cold 24/7 ❄️🔥",
  "Gym pics, no accountability 💪"
];

const boyWithGirls = [
  "Makes you special... briefly 🌸",
  "Good texts, no show 📵",
  "Breadcrumbs only 🍞",
  "Sweet private, single public 🎭"
];

const boyRedFlags = [
  "'No drama' (is the drama) 🚩",
  "Following 2000 girls 👁️",
  "Cryptic mirror selfies 🪞",
  "Bio says 'king' 👑"
];

const boyVerdicts = [
  "Run bestie. Just run. 🏃‍♀️",
  "He's a lesson, not blessing 📚",
  "Block button exists 🔒",
  "Next! 👋"
];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ============ MAIN HOME COMPONENT ============
const Home = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('Bestie');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  // Mood bottle state
  const [filledEmojis, setFilledEmojis] = useState<typeof moodEmojis>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Boy analyzer state
  const [instagramId, setInstagramId] = useState('');
  const [isAnalyzingBoy, setIsAnalyzingBoy] = useState(false);
  const [boyResult, setBoyResult] = useState<{
    mindset: string;
    withGirls: string;
    redFlag: string;
    verdict: string;
    dangerLevel: number;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUserId(session.user.id);

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profile?.display_name) {
        setDisplayName(profile.display_name);
      }

      // Check quiz completion & get preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!preferences?.completed_at) {
        navigate('/quiz');
        return;
      }

      setSuggestions(getSuggestions(preferences));
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Mood bottle functions
  const addEmoji = useCallback((emoji: typeof moodEmojis[0]) => {
    if (filledEmojis.length >= 5) {
      toast({
        title: "Bottle is full! 🧸",
        description: "Save your mood or reset to add more"
      });
      return;
    }

    setFilledEmojis(prev => [...prev, emoji]);
    
    if (soundEnabled) {
      const frequency = 400 + (filledEmojis.length * 80);
      playChime(frequency, 0.3);
    }
  }, [filledEmojis.length, soundEnabled]);

  const resetBottle = () => {
    setFilledEmojis([]);
    if (soundEnabled) playChime(300, 0.5);
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
        description: "Couldn't save. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Boy analyzer
  const analyzeProfile = () => {
    if (!instagramId.trim()) return;
    
    setIsAnalyzingBoy(true);
    setBoyResult(null);

    if (soundEnabled) playChime(440, 0.3);

    setTimeout(() => {
      setBoyResult({
        mindset: getRandomItem(boyMindsets),
        withGirls: getRandomItem(boyWithGirls),
        redFlag: getRandomItem(boyRedFlags),
        verdict: getRandomItem(boyVerdicts),
        dangerLevel: Math.floor(Math.random() * 40) + 60,
      });
      setIsAnalyzingBoy(false);

      if (soundEnabled) {
        playChime(330, 0.3);
        setTimeout(() => playChime(294, 0.4), 200);
      }
    }, 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const avgScore = filledEmojis.length > 0 
    ? filledEmojis.reduce((acc, e) => acc + e.score, 0) / filledEmojis.length
    : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(340 100% 97%) 0%, hsl(280 60% 95%) 50%, hsl(200 80% 95%) 100%)'
        }}
      />

      <CustomCursor />
      <FloatingHearts />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/60 backdrop-blur-md border-b border-kawaii-blush/20">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧸</span>
          <span className="font-bold text-foreground">Hey {displayName}!</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/60 border border-kawaii-blush/30">
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={setSoundEnabled}
              className="scale-75 data-[state=checked]:bg-kawaii-blush"
            />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-background/60 border border-kawaii-blush/30 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Mood Bottle + Stars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-kawaii-cream/60 to-kawaii-blush/40 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4 text-center">
                Mood Bottle 🫙
              </h2>

              {/* Bottle */}
              <CuteBottle filledEmojis={filledEmojis} />

              {/* Mood Stars */}
              {filledEmojis.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <MoodStars score={avgScore} />
                </motion.div>
              )}

              {/* Count */}
              <p className="text-center text-xs text-muted-foreground mt-3">
                {filledEmojis.length}/5 feelings
              </p>

              {/* Emoji picker */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {moodEmojis.map((emoji) => (
                  <motion.button
                    key={emoji.name}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addEmoji(emoji)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-background/60 hover:bg-background/80 transition-colors text-xl"
                    title={emoji.name}
                  >
                    {emoji.emoji}
                  </motion.button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={saveMood}
                  disabled={filledEmojis.length === 0 || isSaving}
                  size="sm"
                  className="flex-1 kawaii-btn rounded-xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-medium gap-1"
                >
                  {isSaving ? '✨' : <><Save className="w-3.5 h-3.5" /> Save</>}
                </Button>
                <Button
                  onClick={resetBottle}
                  disabled={filledEmojis.length === 0}
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-kawaii-blush/30"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Link to Teddy */}
              <Link 
                to="/teddy"
                className="block mt-4 text-center text-sm text-primary hover:underline"
              >
                Talk to Teddy 🧸💬
              </Link>
            </div>
          </motion.div>

          {/* CENTER: Suggestions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Your Personalized Vibes ✨
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${suggestion.color}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-background/60">
                      {suggestion.icon}
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{suggestion.title}</h3>
                  </div>

                  <ul className="space-y-1.5">
                    {suggestion.items.map((item, i) => (
                      <li key={i} className="text-xs text-foreground/80 flex items-center gap-1.5">
                        <span className="text-primary text-[10px]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Boy Analyzer Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-kawaii-lavender/30 to-kawaii-blush/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-400/40 to-pink-400/40">
                    <Instagram className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Boy Analyzer 🔍</h2>
                    <p className="text-muted-foreground text-xs">For entertainment only!</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input
                      value={instagramId}
                      onChange={(e) => setInstagramId(e.target.value)}
                      placeholder="his_instagram"
                      className="pl-7 h-10 bg-background/60 border-kawaii-lavender/30 rounded-xl text-sm"
                    />
                  </div>
                  <Button
                    onClick={analyzeProfile}
                    disabled={isAnalyzingBoy || !instagramId.trim()}
                    className="kawaii-btn h-10 px-4 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium text-sm gap-1"
                  >
                    <Search className="w-4 h-4" />
                    {isAnalyzingBoy ? '🕵️‍♀️' : 'Analyze'}
                  </Button>
                </div>

                <AnimatePresence>
                  {isAnalyzingBoy && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-center justify-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="text-2xl"
                      >
                        🔍
                      </motion.span>
                      <span className="text-sm text-muted-foreground">Scanning red flags...</span>
                    </motion.div>
                  )}

                  {boyResult && !isAnalyzingBoy && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 space-y-3"
                    >
                      {/* Danger bar */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/20">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-muted-foreground">🚨 Red Flag Level</span>
                          <span className="text-lg font-bold text-red-400">{boyResult.dangerLevel}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${boyResult.dangerLevel}%` }}
                            transition={{ duration: 1 }}
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                          />
                        </div>
                      </div>

                      {/* Results grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-background/50 border border-kawaii-lavender/20">
                          <p className="text-[10px] text-muted-foreground mb-0.5">🧠 Mindset</p>
                          <p className="text-xs font-medium text-foreground">{boyResult.mindset}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background/50 border border-kawaii-blush/20">
                          <p className="text-[10px] text-muted-foreground mb-0.5">💕 With Girls</p>
                          <p className="text-xs font-medium text-foreground">{boyResult.withGirls}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background/50 border border-red-400/20 col-span-2">
                          <p className="text-[10px] text-muted-foreground mb-0.5">🚩 Red Flag</p>
                          <p className="text-xs font-medium text-foreground">{boyResult.redFlag}</p>
                        </div>
                      </div>

                      {/* Verdict */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-kawaii-blush/40 to-kawaii-lavender/40 text-center">
                        <p className="text-[10px] text-muted-foreground mb-0.5">✨ Teddy's Verdict</p>
                        <p className="text-sm font-bold text-foreground">{boyResult.verdict}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs text-center text-muted-foreground"
        >
          Made with 💕 for entertainment & comfort only
        </motion.p>
      </main>
    </div>
  );
};

export default Home;
