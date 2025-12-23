import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fakeAnalysis = [
  "Expired conversation energy detected 💀",
  "One-sided effort confirmed. It's giving... nothing.",
  "Dry text alert: hydration needed 🏜️",
  "Read receipt trauma: ACTIVATED",
  "This conversation is on life support",
  "Bare minimum behavior: IDENTIFIED",
  "They're texting someone else. I'm certain.",
  "The energy here is... concerning",
  "Emotional unavailability: 100% detected",
  "This chat has 'we should talk' energy",
  "Interest level: flatlined ⚡",
  "Red flags: So many they could make a quilt 🚩",
];

const verdicts = [
  "Verdict: Block and never look back 🔪",
  "Diagnosis: They're just not that into texting (or you)",
  "Conclusion: You're the main character, they're an NPC",
  "Analysis complete: Time to value yourself more 👑",
  "Final answer: Delete, block, and heal ✨",
];

export const ScreenshotAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResults([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeScreenshot = () => {
    setIsAnalyzing(true);
    setResults([]);

    // Fake analysis with delays
    const numResults = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...fakeAnalysis].sort(() => Math.random() - 0.5);
    const selectedResults = shuffled.slice(0, numResults);

    selectedResults.forEach((result, i) => {
      setTimeout(() => {
        setResults(prev => [...prev, result]);
        
        if (i === selectedResults.length - 1) {
          setTimeout(() => {
            setResults(prev => [...prev, verdicts[Math.floor(Math.random() * verdicts.length)]]);
            setIsAnalyzing(false);
          }, 600);
        }
      }, (i + 1) * 800);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-kawaii-peach/40">
          <ImageIcon className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold sparkle-text">Screenshot Analyzer</h2>
          <p className="text-muted-foreground text-sm">Upload for fake interpretations 📸</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!image ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Upload a chat screenshot</p>
              <p className="text-sm text-muted-foreground mt-1">We won't actually read it, but we'll judge anyway 👀</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-border">
            <img src={image} alt="Uploaded screenshot" className="w-full max-h-64 object-cover" />
            <button
              onClick={() => {
                setImage(null);
                setResults([]);
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
            >
              ✕
            </button>
          </div>

          <Button 
            onClick={analyzeScreenshot}
            disabled={isAnalyzing}
            className="kawaii-btn w-full h-12 rounded-2xl bg-gradient-to-r from-kawaii-peach to-primary text-primary-foreground font-semibold text-lg gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isAnalyzing ? 'Judging Intensely...' : 'Analyze This Mess 🔍'}
          </Button>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                {results.map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl ${
                      i === results.length - 1 
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30' 
                        : 'bg-muted/50 border border-border'
                    }`}
                  >
                    <p className={`${i === results.length - 1 ? 'font-bold text-lg' : ''} text-foreground`}>
                      {result}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
