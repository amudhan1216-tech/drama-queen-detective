import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ArrowRight, ArrowLeft, Sparkles, LogOut } from 'lucide-react';

interface QuizAnswer {
  favorite_color?: string;
  favorite_flower?: string;
  favorite_season?: string;
  favorite_movie_genre?: string;
  favorite_music?: string;
  favorite_hobby?: string;
  favorite_food?: string;
  favorite_drink?: string;
  favorite_dessert?: string;
}

const questions = [
  {
    key: 'favorite_color',
    question: 'What color makes your heart flutter? 🎨',
    options: [
      { value: 'pink', label: 'Pink 💗', emoji: '🌸' },
      { value: 'lavender', label: 'Lavender 💜', emoji: '🪻' },
      { value: 'mint', label: 'Mint 💚', emoji: '🌿' },
      { value: 'peach', label: 'Peach 🧡', emoji: '🍑' },
      { value: 'sky_blue', label: 'Sky Blue 💙', emoji: '☁️' },
      { value: 'cream', label: 'Cream 🤍', emoji: '🕯️' },
    ]
  },
  {
    key: 'favorite_flower',
    question: 'Pick your bloom bestie! 🌷',
    options: [
      { value: 'rose', label: 'Roses 🌹', emoji: '🌹' },
      { value: 'tulip', label: 'Tulips 🌷', emoji: '🌷' },
      { value: 'sunflower', label: 'Sunflowers 🌻', emoji: '🌻' },
      { value: 'cherry_blossom', label: 'Cherry Blossoms 🌸', emoji: '🌸' },
      { value: 'lavender', label: 'Lavender 💜', emoji: '🪻' },
      { value: 'peony', label: 'Peonies 🪷', emoji: '🪷' },
    ]
  },
  {
    key: 'favorite_season',
    question: 'Which season is your aesthetic? ✨',
    options: [
      { value: 'spring', label: 'Spring 🌸', emoji: '🌸' },
      { value: 'summer', label: 'Summer ☀️', emoji: '☀️' },
      { value: 'autumn', label: 'Autumn 🍂', emoji: '🍂' },
      { value: 'winter', label: 'Winter ❄️', emoji: '❄️' },
    ]
  },
  {
    key: 'favorite_movie_genre',
    question: 'Movie night vibes? 🎬',
    options: [
      { value: 'romcom', label: 'Rom-Coms 💕', emoji: '💕' },
      { value: 'fantasy', label: 'Fantasy 🧚', emoji: '🧚' },
      { value: 'drama', label: 'Drama 🎭', emoji: '🎭' },
      { value: 'horror', label: 'Horror 👻', emoji: '👻' },
      { value: 'animation', label: 'Animation ✨', emoji: '✨' },
      { value: 'kdrama', label: 'K-Drama 🇰🇷', emoji: '🇰🇷' },
    ]
  },
  {
    key: 'favorite_music',
    question: 'What\'s on your playlist? 🎧',
    options: [
      { value: 'pop', label: 'Pop 🎤', emoji: '🎤' },
      { value: 'indie', label: 'Indie 🌙', emoji: '🌙' },
      { value: 'kpop', label: 'K-Pop 💜', emoji: '💜' },
      { value: 'lofi', label: 'Lo-Fi ☁️', emoji: '☁️' },
      { value: 'rnb', label: 'R&B 🎵', emoji: '🎵' },
      { value: 'classical', label: 'Classical 🎻', emoji: '🎻' },
    ]
  },
  {
    key: 'favorite_hobby',
    question: 'How do you spend your me-time? 🦋',
    options: [
      { value: 'reading', label: 'Reading 📚', emoji: '📚' },
      { value: 'art', label: 'Art/Drawing 🎨', emoji: '🎨' },
      { value: 'gaming', label: 'Gaming 🎮', emoji: '🎮' },
      { value: 'cooking', label: 'Cooking 🧁', emoji: '🧁' },
      { value: 'shopping', label: 'Shopping 🛍️', emoji: '🛍️' },
      { value: 'journaling', label: 'Journaling ✍️', emoji: '✍️' },
    ]
  },
  {
    key: 'favorite_food',
    question: 'Comfort food? 🍜',
    options: [
      { value: 'pasta', label: 'Pasta 🍝', emoji: '🍝' },
      { value: 'sushi', label: 'Sushi 🍣', emoji: '🍣' },
      { value: 'pizza', label: 'Pizza 🍕', emoji: '🍕' },
      { value: 'ramen', label: 'Ramen 🍜', emoji: '🍜' },
      { value: 'tacos', label: 'Tacos 🌮', emoji: '🌮' },
      { value: 'salad', label: 'Salad 🥗', emoji: '🥗' },
    ]
  },
  {
    key: 'favorite_drink',
    question: 'What\'s your go-to sip? ☕',
    options: [
      { value: 'boba', label: 'Boba Tea 🧋', emoji: '🧋' },
      { value: 'coffee', label: 'Coffee ☕', emoji: '☕' },
      { value: 'matcha', label: 'Matcha 🍵', emoji: '🍵' },
      { value: 'smoothie', label: 'Smoothie 🥤', emoji: '🥤' },
      { value: 'water', label: 'Water 💧', emoji: '💧' },
      { value: 'hot_chocolate', label: 'Hot Chocolate 🍫', emoji: '🍫' },
    ]
  },
  {
    key: 'favorite_dessert',
    question: 'Sweet tooth satisfaction? 🍰',
    options: [
      { value: 'cake', label: 'Cake 🎂', emoji: '🎂' },
      { value: 'ice_cream', label: 'Ice Cream 🍦', emoji: '🍦' },
      { value: 'macarons', label: 'Macarons 🌸', emoji: '🌸' },
      { value: 'cookies', label: 'Cookies 🍪', emoji: '🍪' },
      { value: 'chocolate', label: 'Chocolate 🍫', emoji: '🍫' },
      { value: 'mochi', label: 'Mochi 🍡', emoji: '🍡' },
    ]
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [isLoading, setIsLoading] = useState(true);
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

      // Check if user already has preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (preferences?.completed_at) {
        // User already completed quiz, go to home page
        navigate('/home');
      }

      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAnswer = (value: string) => {
    const key = questions[currentQuestion].key as keyof QuizAnswer;
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...answers,
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "You're all set! 🎀✨",
        description: "Let's check out your personalized suggestions!"
      });

      navigate('/home');
    } catch (error) {
      toast({
        title: "Oops! 😿",
        description: "Couldn't save your answers. Please try again!",
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

  const currentKey = questions[currentQuestion].key as keyof QuizAnswer;
  const isCurrentAnswered = !!answers[currentKey];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
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

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Progress bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-kawaii-blush to-kawaii-lavender rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md"
          >
            <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-kawaii-cream/60 via-kawaii-blush/40 to-kawaii-lavender/40">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
                {questions[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {questions[currentQuestion].options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      answers[currentKey] === option.value
                        ? 'border-primary bg-primary/20 shadow-lg'
                        : 'border-kawaii-blush/30 bg-background/60 hover:border-kawaii-blush/60'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{option.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="w-full max-w-md flex items-center justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="rounded-full px-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentAnswered || isSaving}
              className="kawaii-btn rounded-full px-8 bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold gap-2"
            >
              {isSaving ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  See My Results!
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className="kawaii-btn rounded-full px-8 bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-3 mt-8">
          {['🌷', '✨', '🎀', '💕', '☁️'].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-xl opacity-40"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Quiz;