import { useState } from 'react';
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
