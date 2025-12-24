import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { Sparkles, Heart, Coffee, Film, Music, Palette, ShoppingBag, ArrowRight, LogOut } from 'lucide-react';

interface Suggestion {
  category: string;
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: string;
}

const getSuggestions = (preferences: any): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  // Self-care activities based on color and hobby
  const selfCareByColor: Record<string, string[]> = {
    pink: ['Rose-scented bath bombs 🛁', 'Pink face masks 🌸', 'Strawberry lip balm 💋'],
    lavender: ['Lavender pillow spray 😴', 'Calming aromatherapy 🪻', 'Purple hair clips 💜'],
    mint: ['Green tea skincare 🍵', 'Eucalyptus shower steamer 🌿', 'Jade roller massage 💎'],
    peach: ['Vitamin C serum ✨', 'Peach body butter 🍑', 'Coral nail polish 💅'],
    sky_blue: ['Ocean sounds playlist 🌊', 'Blue light glasses 👓', 'Cloud slime ASMR ☁️'],
    cream: ['Vanilla candle session 🕯️', 'Cozy blanket time 🧸', 'Warm milk & honey 🍯'],
  };

  const selfCare = selfCareByColor[preferences.favorite_color] || selfCareByColor.pink;
  suggestions.push({
    category: 'Self-Care',
    icon: <Heart className="w-5 h-5" />,
    title: 'Pamper Yourself 💆‍♀️',
    items: selfCare,
    color: 'from-pink-400/30 to-rose-400/30'
  });

  // Date ideas based on season and hobby
  const dateIdeas: Record<string, string[]> = {
    spring: ['Picnic in a flower garden 🌷', 'Farmers market date 🍓', 'Outdoor painting session 🎨'],
    summer: ['Beach sunset watch 🌅', 'Ice cream crawl 🍦', 'Stargazing night ✨'],
    autumn: ['Cozy café hopping ☕', 'Pumpkin patch adventure 🎃', 'Sweater weather walk 🍂'],
    winter: ['Hot chocolate date 🍫', 'Ice skating 🎿', 'Movie marathon night 🎬'],
  };

  suggestions.push({
    category: 'Date Ideas',
    icon: <Coffee className="w-5 h-5" />,
    title: `Perfect ${preferences.favorite_season || 'Spring'} Dates 💕`,
    items: dateIdeas[preferences.favorite_season] || dateIdeas.spring,
    color: 'from-orange-400/30 to-amber-400/30'
  });

  // Movie/Show recommendations based on genre
  const movieRecs: Record<string, string[]> = {
    romcom: ['The Proposal 💍', 'Crazy Rich Asians 💎', '10 Things I Hate About You 💕'],
    fantasy: ['Howl\'s Moving Castle 🏰', 'The Shape of Water 🧜‍♀️', 'Pan\'s Labyrinth 🧚'],
    drama: ['Pride & Prejudice 📚', 'Little Women 👯‍♀️', 'La La Land 🌃'],
    horror: ['Midsommar 🌸', 'The Craft 🔮', 'Jennifer\'s Body 💅'],
    animation: ['Spirited Away 🌊', 'Your Name ⭐', 'Encanto 🦋'],
    kdrama: ['Crash Landing on You 💕', 'Goblin 👻', 'Reply 1988 📺'],
  };

  suggestions.push({
    category: 'Watch List',
    icon: <Film className="w-5 h-5" />,
    title: 'Your Movie Night 🎬',
    items: movieRecs[preferences.favorite_movie_genre] || movieRecs.romcom,
    color: 'from-purple-400/30 to-violet-400/30'
  });

  // Music based on preference
  const musicRecs: Record<string, string[]> = {
    pop: ['Ariana Grande - thank u, next 💅', 'Dua Lipa - Levitating 🪩', 'Olivia Rodrigo - good 4 u 💔'],
    indie: ['Clairo - Pretty Girl 🌙', 'Girl in Red - we fell in love in october 🍂', 'Phoebe Bridgers - Motion Sickness 🌧️'],
    kpop: ['BLACKPINK - How You Like That 💖', 'NewJeans - Ditto 🎀', 'aespa - Next Level ✨'],
    lofi: ['Coffee Shop Vibes playlist ☕', 'Study With Me streams 📚', 'Rainy Day Lo-Fi 🌧️'],
    rnb: ['SZA - Kill Bill 💕', 'Summer Walker - Playing Games 🎮', 'Jhené Aiko - Sativa 🍃'],
    classical: ['Debussy - Clair de Lune 🌙', 'Chopin - Nocturnes 🌸', 'Tchaikovsky - Swan Lake 🦢'],
  };

  suggestions.push({
    category: 'Playlist',
    icon: <Music className="w-5 h-5" />,
    title: 'Your Vibe 🎧',
    items: musicRecs[preferences.favorite_music] || musicRecs.pop,
    color: 'from-cyan-400/30 to-blue-400/30'
  });

  // Shopping based on aesthetic
  const shoppingRecs: Record<string, string[]> = {
    pink: ['Pastel pink cardigan 🌸', 'Heart-shaped sunglasses 💕', 'Strawberry tote bag 🍓'],
    lavender: ['Purple butterfly clips 🦋', 'Lilac mini dress 💜', 'Amethyst jewelry 💎'],
    mint: ['Sage green scrunchies 🌿', 'Matcha aesthetic water bottle 🍵', 'Eucalyptus candle 🕯️'],
    peach: ['Peachy blush palette 🍑', 'Coral summer dress 🌺', 'Apricot perfume 🧴'],
    sky_blue: ['Cloud phone case ☁️', 'Light wash denim jacket 👖', 'Blue butterfly earrings 🦋'],
    cream: ['Beige knit sweater 🧸', 'Vanilla lip gloss 💋', 'Neutral aesthetic room decor 🪴'],
  };

  suggestions.push({
    category: 'Shopping',
    icon: <ShoppingBag className="w-5 h-5" />,
    title: 'Treat Yourself 🛍️',
    items: shoppingRecs[preferences.favorite_color] || shoppingRecs.pink,
    color: 'from-rose-400/30 to-pink-400/30'
  });

  // Mood activities based on hobby and drink
  const moodActivities: string[] = [];
  
  if (preferences.favorite_hobby === 'reading') {
    moodActivities.push('Start a book club 📖');
  } else if (preferences.favorite_hobby === 'art') {
    moodActivities.push('Try watercolor painting 🎨');
  } else if (preferences.favorite_hobby === 'gaming') {
    moodActivities.push('Cozy games like Stardew Valley 🎮');
  }

  if (preferences.favorite_drink === 'boba') {
    moodActivities.push('Boba shop tour with besties 🧋');
  } else if (preferences.favorite_drink === 'matcha') {
    moodActivities.push('At-home matcha latte making ☕');
  }

  if (preferences.favorite_dessert === 'macarons') {
    moodActivities.push('Macaron baking day 🌸');
  } else if (preferences.favorite_dessert === 'mochi') {
    moodActivities.push('Mochi ice cream taste test 🍡');
  }

  if (moodActivities.length < 3) {
    moodActivities.push('Solo journaling session ✍️', 'Dance party in your room 💃', 'Pinterest board making 📌');
  }

  suggestions.push({
    category: 'Activities',
    icon: <Palette className="w-5 h-5" />,
    title: 'Mood Boosters 🌈',
    items: moodActivities.slice(0, 3),
    color: 'from-emerald-400/30 to-teal-400/30'
  });

  return suggestions;
};

const Suggestions = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('Bestie');

  useEffect(() => {
    const loadSuggestions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Get display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profile?.display_name) {
        setDisplayName(profile.display_name);
      }

      // Get preferences
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
      setIsLoading(false);
    };

    loadSuggestions();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(340 100% 97%) 0%, hsl(280 60% 95%) 50%, hsl(200 80% 95%) 100%)'
        }}
      />

      <CustomCursor />
      <FloatingHearts />

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30 text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm hidden sm:inline">Logout</span>
      </button>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            ✨
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Hey {displayName}! 💕
          </h1>
          <p className="text-muted-foreground text-lg">
            Based on your vibes, here's what we think you'll love! 🎀
          </p>
        </motion.div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card rounded-3xl p-6 bg-gradient-to-br ${suggestion.color}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-background/60">
                  {suggestion.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground">{suggestion.title}</h3>
              </div>

              <ul className="space-y-3">
                {suggestion.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                    className="flex items-center gap-2 text-foreground/80"
                  >
                    <span className="text-primary">•</span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA to Mood Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link to="/mood">
            <Button className="kawaii-btn h-14 px-8 rounded-2xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold text-lg gap-2">
              <Sparkles className="w-5 h-5" />
              Track My Mood 🧸
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-xs text-center text-muted-foreground"
        >
          These suggestions are based on your favorites! ✨
        </motion.p>
      </main>
    </div>
  );
};

export default Suggestions;