import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { OverthinkingGenerator } from '@/components/OverthinkingGenerator';
import { MoodDetector } from '@/components/MoodDetector';
import { SeenPanicTimer } from '@/components/SeenPanicTimer';
import { DelusionSlider } from '@/components/DelusionSlider';
import { BestieMode } from '@/components/BestieMode';
import { ScreenshotAnalyzer } from '@/components/ScreenshotAnalyzer';
import { LateNightMode } from '@/components/LateNightMode';
import { CryPlaylist } from '@/components/CryPlaylist';
import { DailyAffirmation } from '@/components/DailyAffirmation';
import { ShareableCard } from '@/components/ShareableCard';
import { LogOut, Heart, Coffee, Film, Music, ShoppingBag, Palette } from 'lucide-react';

// Suggestions logic
const getSuggestions = (preferences: any) => {
  const suggestions = [];
  const selfCareByColor: Record<string, string[]> = {
    pink: ['Rose bath bombs 🛁', 'Pink face masks 🌸', 'Berry lip balm 💋'],
    lavender: ['Lavender spray 😴', 'Aromatherapy 🪻', 'Purple clips 💜'],
    mint: ['Green tea care 🍵', 'Eucalyptus 🌿', 'Jade roller 💎'],
    peach: ['Vitamin C ✨', 'Peach butter 🍑', 'Coral nails 💅'],
    sky_blue: ['Ocean sounds 🌊', 'Blue glasses 👓', 'Cloud vibes ☁️'],
    cream: ['Vanilla candle 🕯️', 'Cozy blanket 🧸', 'Honey milk 🍯'],
  };
  suggestions.push({ icon: <Heart className="w-4 h-4" />, title: 'Self-Care 💆‍♀️', items: selfCareByColor[preferences?.favorite_color] || selfCareByColor.pink, color: 'from-pink-400/20 to-rose-400/20' });

  const dateIdeas: Record<string, string[]> = { spring: ['Flower picnic 🌷', 'Market date 🍓'], summer: ['Beach sunset 🌅', 'Ice cream 🍦'], autumn: ['Café hopping ☕', 'Pumpkin patch 🎃'], winter: ['Hot chocolate 🍫', 'Movie night 🎬'] };
  suggestions.push({ icon: <Coffee className="w-4 h-4" />, title: 'Date Ideas 💕', items: dateIdeas[preferences?.favorite_season] || dateIdeas.spring, color: 'from-orange-400/20 to-amber-400/20' });

  const movieRecs: Record<string, string[]> = { romcom: ['The Proposal 💍', 'Crazy Rich Asians 💎'], fantasy: ["Howl's Castle 🏰", 'Spirited Away 🌊'], drama: ['Pride & Prejudice 📚', 'La La Land 🌃'], kdrama: ['Crash Landing 💕', 'Goblin 👻'] };
  suggestions.push({ icon: <Film className="w-4 h-4" />, title: 'Watch 🎬', items: movieRecs[preferences?.favorite_movie_genre] || movieRecs.romcom, color: 'from-purple-400/20 to-violet-400/20' });

  const musicRecs: Record<string, string[]> = { pop: ['Ariana Grande 💅', 'Dua Lipa 🪩'], kpop: ['BLACKPINK 💖', 'NewJeans 🎀'], indie: ['Clairo 🌙', 'Phoebe Bridgers 🌧️'], lofi: ['Study Vibes 📚', 'Rainy Lo-Fi 🌧️'] };
  suggestions.push({ icon: <Music className="w-4 h-4" />, title: 'Music 🎧', items: musicRecs[preferences?.favorite_music] || musicRecs.pop, color: 'from-cyan-400/20 to-blue-400/20' });

  const shoppingRecs: Record<string, string[]> = { pink: ['Pink cardigan 🌸', 'Heart shades 💕'], lavender: ['Butterfly clips 🦋', 'Lilac dress 💜'], mint: ['Sage scrunchies 🌿'], peach: ['Peachy blush 🍑'], sky_blue: ['Cloud case ☁️'], cream: ['Beige sweater 🧸'] };
  suggestions.push({ icon: <ShoppingBag className="w-4 h-4" />, title: 'Shopping 🛍️', items: shoppingRecs[preferences?.favorite_color] || shoppingRecs.pink, color: 'from-rose-400/20 to-pink-400/20' });

  suggestions.push({ icon: <Palette className="w-4 h-4" />, title: 'Activities 🌈', items: ['Solo journal ✍️', 'Dance party 💃', 'Pinterest 📌'], color: 'from-emerald-400/20 to-teal-400/20' });

  return suggestions;
};

const Home = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('Bestie');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [delusionLevel, setDelusionLevel] = useState(50);
  const [isBestieMode, setIsBestieMode] = useState(false);
  const [isLateNight, setIsLateNight] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }

      const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', session.user.id).maybeSingle();
      if (profile?.display_name) setDisplayName(profile.display_name);

      const { data: preferences } = await supabase.from('user_preferences').select('*').eq('user_id', session.user.id).maybeSingle();
      if (!preferences?.completed_at) { navigate('/quiz'); return; }
      setSuggestions(getSuggestions(preferences));
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/auth'); };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${isLateNight ? 'bg-slate-900' : 'bg-background'}`}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: isLateNight ? 'radial-gradient(ellipse at top, hsl(260 50% 15%) 0%, hsl(240 30% 10%) 100%)' : 'radial-gradient(ellipse at top, hsl(340 100% 97%) 0%, hsl(280 60% 95%) 50%, hsl(200 80% 95%) 100%)' }} />
      <CustomCursor />
      <FloatingHearts />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/60 backdrop-blur-md border-b border-kawaii-blush/20">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧸</span>
          <span className={`font-bold ${isLateNight ? 'text-purple-200' : 'text-foreground'}`}>Hey {displayName}!</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/mood" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground text-xs font-medium">Mood Bottle 🫙</Link>
          <button onClick={handleLogout} className="p-2 rounded-full bg-background/60 border border-kawaii-blush/30 text-muted-foreground hover:text-foreground"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* LEFT: Pinterest Suggestions */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className={`text-sm font-bold ${isLateNight ? 'text-purple-200' : 'text-foreground'}`}>Your Vibes ✨</h3>
            {suggestions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`glass-card rounded-xl p-3 bg-gradient-to-br ${s.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded-lg bg-background/60">{s.icon}</div>
                  <span className="text-xs font-bold text-foreground">{s.title}</span>
                </div>
                <ul className="space-y-1">{s.items.map((item: string, j: number) => <li key={j} className="text-[11px] text-foreground/80">• {item}</li>)}</ul>
              </motion.div>
            ))}
          </div>

          {/* CENTER & RIGHT: Features */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DelusionSlider value={delusionLevel} onChange={setDelusionLevel} />
            <BestieMode enabled={isBestieMode} onToggle={setIsBestieMode} />
            <OverthinkingGenerator delusionLevel={delusionLevel} bestieMode={isBestieMode} />
            <MoodDetector />
            <SeenPanicTimer />
            <ScreenshotAnalyzer />
            <LateNightMode onModeChange={setIsLateNight} />
            <CryPlaylist />
            <ShareableCard />
          </div>
        </div>
      </main>

      <DailyAffirmation />
    </div>
  );
};

export default Home;
