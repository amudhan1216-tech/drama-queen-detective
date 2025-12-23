import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, AlertTriangle, Heart, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const overthinkingThoughts = [
  "They typed for 3 minutes and said 'ok'??? THE AUDACITY.",
  "That period at the end? Passive aggressive. Confirmed.",
  "They're definitely showing this to their friends and laughing.",
  "Wait... are they talking to someone else RIGHT NOW?",
  "The 'lol' was lowercase. They're not even trying.",
  "This is giving 'I'm texting you from their funeral' energy.",
  "They used to send paragraphs. Now this. Growth? No. BETRAYAL.",
  "Reading between the lines: they want you to suffer.",
  "That emoji choice? Strategic emotional warfare.",
  "The reply time suggests they had time to write more. They chose violence.",
  "This has 'I forgot you existed' written all over it.",
  "They're clearly in love with someone else already.",
  "The lack of exclamation points is CONCERNING.",
  "This text radiates 'I'm texting you while on a date' vibes.",
  "They definitely screenshot this to mock you.",
  "The dry response? A masterclass in emotional detachment.",
];

const verdicts = [
  "Emotionally unavailable but online 🚩",
  "Bare minimum certified ✨ pathetic edition",
  "Main character in their own story, NPC in yours",
  "Texting skills: ✨ expired ✨",
  "Interest level: legally dead",
  "Verdict: if they wanted to, they WOULDN'T 💀",
  "Giving: I'll reply when Mercury is in retrograde",
  "Status: situationship survivor in the making",
  "Energy: confused but make it ✨aesthetic✨",
  "Diagnosis: chronic low-effort syndrome",
];

interface OverthinkingGeneratorProps {
  delusionLevel: number;
  bestieMode: boolean;
}

export const OverthinkingGenerator = ({ delusionLevel, bestieMode }: OverthinkingGeneratorProps) => {
  const [input, setInput] = useState('');
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [verdict, setVerdict] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateThoughts = () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setThoughts([]);
    setVerdict('');

    // Number of thoughts based on delusion level
    const thoughtCount = 3 + Math.floor(delusionLevel / 25);
    
    // Generate thoughts with delays
    const shuffled = [...overthinkingThoughts].sort(() => Math.random() - 0.5);
    const selectedThoughts = shuffled.slice(0, thoughtCount);

    selectedThoughts.forEach((thought, i) => {
      setTimeout(() => {
        setThoughts(prev => [...prev, thought]);
        
        // Add bestie mode reactions
        if (bestieMode && i === thoughtCount - 1) {
          setTimeout(() => {
            const bestieAddition = [
              "BESTIE. BLOCK HIM. NOW. 🔪",
              "I'm so sorry babe... you deserve SO much better 😭",
              "They're a walking red flag. I said what I said.",
              "This is NOT the energy we're accepting in 2024.",
            ];
            setThoughts(prev => [...prev, bestieAddition[Math.floor(Math.random() * bestieAddition.length)]]);
          }, 500);
        }
      }, (i + 1) * 600);
    });

    // Generate verdict
    setTimeout(() => {
      const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
      setVerdict(randomVerdict);
      setIsGenerating(false);
    }, (thoughtCount + 1) * 600 + 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-primary/20">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold sparkle-text">Overthinking Generator</h2>
          <p className="text-muted-foreground text-sm">Paste their message. Let the chaos begin.</p>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="e.g., He replied ok or She said we'll see"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary rounded-2xl resize-none text-base"
        />
        
        <Button 
          onClick={generateThoughts}
          disabled={isGenerating || !input.trim()}
          className="kawaii-btn w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {isGenerating ? 'Spiraling...' : 'Overthink This 🌀'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {thoughts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 space-y-3"
          >
            {thoughts.map((thought, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
              >
                <span className="text-xl mt-0.5">
                  {i === thoughts.length - 1 && bestieMode ? '👯‍♀️' : ['😰', '💭', '🚨', '😭', '💀', '🙃'][i % 6]}
                </span>
                <p className="text-foreground/90 leading-relaxed">{thought}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verdict && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary uppercase tracking-wide text-sm">Final Dramatic Verdict</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground">{verdict}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
