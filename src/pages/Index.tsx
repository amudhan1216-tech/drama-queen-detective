import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const floatingEmojis = ['💕', '✨', '🌸', '🎀', '☁️', '🦋', '💫', '🌷', '🤍', '💗'];

const Index = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0); // 0: initial, 1: text1, 2: text2, 3: teddy, 4: redirect
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, check if they completed quiz
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('completed_at')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (preferences?.completed_at) {
          navigate('/home');
        } else {
          navigate('/quiz');
        }
        return;
      }

      setIsCheckingAuth(false);
      // Start animation sequence
      startAnimations();
    };

    checkAuth();
  }, [navigate]);

  const startAnimations = () => {
    // Stage 1: First text appears
    setTimeout(() => setStage(1), 500);
    // Stage 2: Second text
    setTimeout(() => setStage(2), 2000);
    // Stage 3: Teddy appears
    setTimeout(() => setStage(3), 3500);
    // Stage 4: Redirect to auth
    setTimeout(() => {
      setStage(4);
      navigate('/auth');
    }, 5500);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at top, hsl(340 100% 97%) 0%, hsl(280 60% 95%) 50%, hsl(320 80% 94%) 100%)'
      }}
    >
      {/* Floating background emojis */}
      {floatingEmojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="fixed text-3xl md:text-4xl opacity-30 pointer-events-none"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: 0
          }}
          animate={{ 
            y: -100,
            rotate: 360,
            x: Math.random() * window.innerWidth
          }}
          transition={{ 
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'linear'
          }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* Sparkle particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="fixed w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 pointer-events-none"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            opacity: 0
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <AnimatePresence mode="wait">
          {/* Stage 1: Welcome text */}
          {stage >= 1 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, hsl(340 82% 55%) 0%, hsl(280 60% 60%) 50%, hsl(200 80% 60%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Hey Girlie! 💕
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-center gap-2 mt-4"
              >
                {['🌸', '✨', '💗', '✨', '🌸'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity
                    }}
                    className="text-2xl md:text-3xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Stage 2: Subtitle */}
          {stage >= 2 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="text-xl md:text-2xl text-foreground/80 font-medium">
                Your cute mood companion is here 🎀
              </p>
              <motion.p 
                className="text-lg text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Let's discover your vibe together ✨
              </motion.p>
            </motion.div>
          )}

          {/* Stage 3: Big animated teddy */}
          {stage >= 3 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 0.8,
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative"
            >
              {/* Glow effect behind teddy */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div 
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(circle, hsl(340 82% 65% / 0.5) 0%, transparent 70%)' }}
                />
              </motion.div>

              {/* Teddy emoji */}
              <motion.span 
                className="text-[8rem] md:text-[12rem] lg:text-[14rem] block relative z-10"
                animate={{ 
                  rotate: [-5, 5, -5],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{ 
                  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))'
                }}
              >
                🧸
              </motion.span>

              {/* Hearts around teddy */}
              {['💕', '🤍', '✨', '💗', '☁️', '🌷'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-3xl md:text-4xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos((i / 6) * Math.PI * 2) * 150,
                    y: Math.sin((i / 6) * Math.PI * 2) * 150 - 50
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  {emoji}
                </motion.span>
              ))}

              {/* Loading text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground mt-8"
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Opening the door for you...
                </motion.span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom decorative wave */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
            fill="url(#waveGradient)"
            initial={{ d: "M0,80 C360,80 1080,80 1440,80 L1440,120 L0,120 Z" }}
            animate={{ d: "M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(340 82% 85% / 0.5)" />
              <stop offset="50%" stopColor="hsl(280 60% 85% / 0.5)" />
              <stop offset="100%" stopColor="hsl(200 80% 85% / 0.5)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};

export default Index;