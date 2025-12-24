import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const floatingEmojis = ['💕', '✨', '🌸', '🎀', '☁️', '🦋', '💫', '🌷', '🤍', '💗'];

const Index = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0); // 0: initial, 1: hi gurls pop, 2: subtitle, 3: teddy, 4: redirect
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
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
      startAnimations();
    };

    checkAuth();
  }, [navigate]);

  const startAnimations = () => {
    setTimeout(() => setStage(1), 300);
    setTimeout(() => setStage(2), 2000);
    setTimeout(() => setStage(3), 3500);
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
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 100,
            rotate: 0
          }}
          animate={{ 
            y: -100,
            rotate: 360,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800)
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
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
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
          {/* Stage 1: HI GURLS - Big Pop Animation */}
          {stage >= 1 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.3, 1] }}
              transition={{ 
                duration: 0.8, 
                ease: [0.34, 1.56, 0.64, 1], // Bouncy spring
                scale: { times: [0, 0.6, 1] }
              }}
              className="mb-8"
            >
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
                animate={{ 
                  rotate: [0, -3, 3, -2, 2, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.8
                }}
                style={{
                  background: 'linear-gradient(135deg, hsl(340 90% 60%) 0%, hsl(300 70% 55%) 30%, hsl(280 80% 60%) 60%, hsl(200 90% 55%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 60px hsla(340, 80%, 60%, 0.4)'
                }}
              >
                HI GURLS! 💕
              </motion.h1>
              
              {/* Exploding emojis around text */}
              {['✨', '💖', '🌸', '🎀', '💗', '☁️', '🦋', '💫'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-3xl md:text-4xl"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 1.2, 0],
                    x: Math.cos((i / 8) * Math.PI * 2) * 180,
                    y: Math.sin((i / 8) * Math.PI * 2) * 120
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.3 + i * 0.08,
                    ease: 'easeOut'
                  }}
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  {emoji}
                </motion.span>
              ))}
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex justify-center gap-3 mt-6"
              >
                {['🌸', '✨', '💗', '✨', '🌸'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      y: [0, -15, 0],
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 1.2,
                      delay: i * 0.12,
                      repeat: Infinity
                    }}
                    className="text-2xl md:text-4xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Stage 2: Subtitle with pop */}
          {stage >= 2 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-12"
            >
              <p className="text-xl md:text-2xl text-foreground/80 font-semibold">
                Your cute mood companion is loading... 🎀
              </p>
              <motion.p 
                className="text-lg text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Get ready to vibe ✨
              </motion.p>
            </motion.div>
          )}

          {/* Stage 3: Big animated teddy */}
          {stage >= 3 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative"
            >
              {/* Glow effect behind teddy */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div 
                  className="w-52 h-52 md:w-72 md:h-72 rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(circle, hsl(340 90% 70% / 0.6) 0%, hsl(280 70% 60% / 0.3) 50%, transparent 70%)' }}
                />
              </motion.div>

              {/* Teddy emoji */}
              <motion.span 
                className="text-[10rem] md:text-[14rem] lg:text-[16rem] block relative z-10"
                animate={{ 
                  rotate: [-8, 8, -8],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{ 
                  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
                }}
              >
                🧸
              </motion.span>

              {/* Hearts around teddy */}
              {['💕', '🤍', '✨', '💗', '☁️', '🌷', '💖', '🎀'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-3xl md:text-4xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos((i / 8) * Math.PI * 2) * 160,
                    y: Math.sin((i / 8) * Math.PI * 2) * 160 - 50
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                    repeatDelay: 0.5
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
                className="text-lg text-muted-foreground mt-8 font-medium"
              >
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
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
        transition={{ delay: 0.8 }}
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