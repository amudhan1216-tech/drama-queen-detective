import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { Header } from '@/components/Header';
import { OverthinkingGenerator } from '@/components/OverthinkingGenerator';
import { MoodDetector } from '@/components/MoodDetector';
import { SeenPanicTimer } from '@/components/SeenPanicTimer';
import { DelusionSlider } from '@/components/DelusionSlider';
import { BestieMode } from '@/components/BestieMode';
import { ScreenshotAnalyzer } from '@/components/ScreenshotAnalyzer';
import { CryPlaylist } from '@/components/CryPlaylist';
import { DailyAffirmation } from '@/components/DailyAffirmation';
import { LateNightMode } from '@/components/LateNightMode';
import { ShareableCard } from '@/components/ShareableCard';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [delusionLevel, setDelusionLevel] = useState(50);
  const [bestieMode, setBestieMode] = useState(false);
  const [isLateNight, setIsLateNight] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: isLateNight 
            ? 'radial-gradient(ellipse at top, hsl(280 50% 15%) 0%, hsl(260 30% 8%) 100%)'
            : 'radial-gradient(ellipse at top, hsl(340 100% 97%) 0%, hsl(280 60% 95%) 50%, hsl(200 80% 95%) 100%)'
        }}
      />

      {/* Custom cursor */}
      <CustomCursor />
      
      {/* Floating hearts background */}
      <FloatingHearts />
      
      {/* Late night mode toggle */}
      <LateNightMode onModeChange={setIsLateNight} />
      
      {/* Daily affirmation popup */}
      <DailyAffirmation />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pb-16">
        <Header />

        {/* Teddy Companion Link Card */}
        <Link to="/teddy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-3xl p-6 md:p-8 mb-8 bg-gradient-to-r from-kawaii-cream/80 via-kawaii-blush/40 to-kawaii-lavender/40 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.span 
                  className="text-5xl md:text-6xl"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🧸
                </motion.span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">Teddy Mood Companion</h2>
                  <p className="text-muted-foreground text-sm">Get a big warm hug from Teddy 🤍</p>
                </div>
              </div>
              <motion.div
                className="p-3 rounded-full bg-kawaii-blush/30 group-hover:bg-kawaii-blush/50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="w-5 h-5 text-foreground" />
              </motion.div>
            </div>
          </motion.div>
        </Link>

        {/* Controls row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DelusionSlider value={delusionLevel} onChange={setDelusionLevel} />
          <div className="space-y-6">
            <BestieMode enabled={bestieMode} onToggle={setBestieMode} />
            <CryPlaylist />
          </div>
        </div>

        {/* Main features grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OverthinkingGenerator delusionLevel={delusionLevel} bestieMode={bestieMode} />
          <MoodDetector />
          <SeenPanicTimer />
          <ScreenshotAnalyzer />
          <ShareableCard />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Made with 💕 and a lot of emotional damage
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            This is a joke app. Please don't actually make life decisions based on this. 🌸
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
