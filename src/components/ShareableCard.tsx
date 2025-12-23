import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const randomVerdicts = [
  "Emotionally unavailable but online 🚩",
  "Bare minimum certified ✨",
  "Giving: confused energy",
  "Interest level: legally dead 💀",
  "Status: situationship survivor",
];

export const ShareableCard = () => {
  const [situation, setSituation] = useState('');
  const [generated, setGenerated] = useState(false);
  const [verdict, setVerdict] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const generateCard = () => {
    if (!situation.trim()) return;
    setVerdict(randomVerdicts[Math.floor(Math.random() * randomVerdicts.length)]);
    setGenerated(true);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    // For now, we'll show a message since html-to-canvas isn't available
    alert('Screenshot this card to share! 📸✨');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-primary/20">
          <Share2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold sparkle-text">Shareable Result Card</h2>
          <p className="text-muted-foreground text-sm">Create aesthetic cards to share</p>
        </div>
      </div>

      {!generated ? (
        <div className="space-y-4">
          <Input
            placeholder="What did they say/do?"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="bg-background/50 border-primary/20 focus:border-primary rounded-xl h-12"
          />
          <Button 
            onClick={generateCard}
            disabled={!situation.trim()}
            className="kawaii-btn w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-kawaii-lavender text-primary-foreground font-semibold text-lg gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate Card ✨
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            ref={cardRef}
            className="relative p-6 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(340 82% 85%), hsl(280 60% 85%), hsl(200 80% 90%))',
            }}
          >
            {/* Sparkle decorations */}
            <div className="absolute top-2 left-2 text-2xl">✨</div>
            <div className="absolute top-2 right-2 text-2xl">💕</div>
            <div className="absolute bottom-2 left-2 text-2xl">🌸</div>
            <div className="absolute bottom-2 right-2 text-2xl">⭐</div>

            <div className="text-center py-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Overthink Palace 🌸
              </p>
              <p className="text-lg font-medium text-foreground mb-4 px-4">
                "{situation}"
              </p>
              <div className="inline-block px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-primary/30">
                <p className="text-xl font-bold text-foreground">{verdict}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                overthinkpalace.app ✨
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={downloadCard}
              className="kawaii-btn flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary gap-2"
            >
              <Download className="w-5 h-5" />
              Screenshot to Share
            </Button>
            <Button 
              onClick={() => {
                setGenerated(false);
                setSituation('');
              }}
              variant="outline"
              className="h-12 rounded-2xl border-2 border-primary/30"
            >
              New Card
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
