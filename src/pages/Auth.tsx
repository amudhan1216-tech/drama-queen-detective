import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { Heart, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/quiz');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/quiz');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Oops! 💔",
              description: "Email or password is incorrect. Try again bestie!",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Something went wrong 😿",
              description: error.message,
              variant: "destructive"
            });
          }
        }
      } else {
        const redirectUrl = `${window.location.origin}/quiz`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              display_name: displayName
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Already one of us! 💕",
              description: "This email is already registered. Try logging in instead!",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Oops! 🌸",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Welcome bestie! 🎀✨",
            description: "Account created! Let's discover your vibe!"
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something unexpected happened. Please try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(340 100% 97%) 0%, hsl(280 60% 95%) 50%, hsl(200 80% 95%) 100%)'
        }}
      />

      <CustomCursor />
      <FloatingHearts />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🧸
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {isLogin ? 'Welcome Back!' : 'Join the Vibe'} 💕
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'We missed you bestie! 🌸' : 'Let\'s discover your inner sparkle ✨'}
          </p>
        </div>

        {/* Auth Card */}
        <motion.div 
          className="glass-card rounded-3xl p-8 bg-gradient-to-br from-kawaii-cream/60 via-kawaii-blush/40 to-kawaii-lavender/40"
          layout
        >
          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="displayName" className="text-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="What should we call you? 🌷"
                    className="h-12 bg-background/60 border-kawaii-blush/30 rounded-2xl"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="h-12 bg-background/60 border-kawaii-blush/30 rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Shh... it's a secret 🤫"
                className="h-12 bg-background/60 border-kawaii-blush/30 rounded-2xl"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="kawaii-btn w-full h-14 rounded-2xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold text-lg gap-2"
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ✨
                </motion.span>
              ) : isLogin ? (
                <>
                  <Heart className="w-5 h-5" />
                  Let Me In! 💕
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create My Account ✨
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {isLogin ? (
                <>New here? <span className="text-primary font-medium">Create an account 🌸</span></>
              ) : (
                <>Already a bestie? <span className="text-primary font-medium">Sign in 💫</span></>
              )}
            </button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-3 mt-6">
          {['🌷', '✨', '🎀', '💕', '☁️'].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-2xl opacity-60"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;