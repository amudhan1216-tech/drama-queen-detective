import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ArrowLeft, RotateCcw, Save, Star, Volume2, VolumeX } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const moodEmojis = [
  { emoji: '😊', name: 'Happy', color: '#FFD93D', score: 5 },
  { emoji: '🥰', name: 'Loved', color: '#FF6B9D', score: 5 },
  { emoji: '😌', name: 'Calm', color: '#6BCB77', score: 4 },
  { emoji: '🥺', name: 'Soft', color: '#93C5FD', score: 3 },
  { emoji: '😢', name: 'Sad', color: '#60A5FA', score: 2 },
  { emoji: '😤', name: 'Frustrated', color: '#F87171', score: 2 },
  { emoji: '😰', name: 'Anxious', color: '#A78BFA', score: 2 },
  { emoji: '😴', name: 'Tired', color: '#94A3B8', score: 3 },
  { emoji: '🤔', name: 'Confused', color: '#FBBF24', score: 3 },
  { emoji: '✨', name: 'Excited', color: '#F472B6', score: 5 },
];

const playChime = (freq = 523, dur = 0.4) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
  } catch {}
};

const CuteBottle = ({ filledEmojis }: { filledEmojis: typeof moodEmojis }) => {
  const fill = (filledEmojis.length / 5) * 100;
  return (
    <div className="relative w-44 h-64 mx-auto">
      <svg viewBox="0 0 100 150" className="w-full h-full">
        <defs>
          <clipPath id="jar"><path d="M15 35 Q15 45 20 50 L20 130 Q20 140 35 140 L65 140 Q80 140 80 130 L80 50 Q85 45 85 35 L85 30 Q85 25 80 25 L20 25 Q15 25 15 30 Z" /></clipPath>
          <linearGradient id="fill" x1="0%" y1="100%" x2="0%" y2="0%">{filledEmojis.map((e, i) => <stop key={i} offset={`${(i / Math.max(filledEmojis.length - 1, 1)) * 100}%`} stopColor={e.color} stopOpacity="0.7" />)}</linearGradient>
        </defs>
        <g clipPath="url(#jar)"><rect x="0" y="0" width="100" height="150" fill="rgba(255,255,255,0.3)" />
          <motion.rect x="15" y={140 - fill * 1.1} width="70" height={fill * 1.1} initial={{ height: 0, y: 140 }} animate={{ height: fill * 1.1, y: 140 - fill * 1.1 }} transition={{ duration: 0.5 }} fill="url(#fill)" /></g>
        <path d="M15 35 Q15 45 20 50 L20 130 Q20 140 35 140 L65 140 Q80 140 80 130 L80 50 Q85 45 85 35 L85 30 Q85 25 80 25 L20 25 Q15 25 15 30 Z" fill="none" stroke="hsl(340 30% 75%)" strokeWidth="3" />
        <rect x="18" y="15" width="64" height="12" rx="3" fill="hsl(340 40% 85%)" stroke="hsl(340 30% 70%)" strokeWidth="2" />
        <ellipse cx="50" cy="12" rx="12" ry="5" fill="none" stroke="hsl(340 30% 70%)" strokeWidth="2" />
        <g transform="translate(50, 28)"><ellipse cx="-8" cy="0" rx="6" ry="4" fill="hsl(340 70% 75%)" /><ellipse cx="8" cy="0" rx="6" ry="4" fill="hsl(340 70% 75%)" /><circle cx="0" cy="0" r="3" fill="hsl(340 80% 65%)" /></g>
        <path d="M25 50 L25 120" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">{filledEmojis.map((e, i) => <motion.span key={i} className="absolute text-2xl" initial={{ opacity: 0, y: 50, scale: 0 }} animate={{ opacity: 1, y: 120 - i * 22, x: 55 + Math.sin(i * 2) * 20, scale: 1, rotate: Math.random() * 30 - 15 }} transition={{ delay: 0.1, duration: 0.4 }}>{e.emoji}</motion.span>)}</div>
      {filledEmojis.length === 5 && [...Array(5)].map((_, i) => <motion.span key={i} className="absolute text-sm" style={{ left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 20}%` }} animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}>✨</motion.span>)}
    </div>
  );
};

const MoodStars = ({ score }: { score: number }) => {
  const filled = Math.round((score / 5) * 5);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground">Mood Level</span>
      <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}><Star className={`w-6 h-6 ${i < filled ? 'text-yellow-400 fill-yellow-400' : 'text-muted/30'}`} /></motion.div>)}</div>
      <span className="text-xs text-muted-foreground">{filled === 5 ? 'Amazing! ✨' : filled >= 4 ? 'Great! 🌟' : filled >= 3 ? 'Okay 🌸' : filled >= 2 ? 'Hang in there 💕' : 'Sending hugs 🤍'}</span>
    </div>
  );
};

const MoodBottle = () => {
  const navigate = useNavigate();
  const [filledEmojis, setFilledEmojis] = useState<typeof moodEmojis>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      setUserId(session.user.id);
    };
    check();
  }, [navigate]);

  const addEmoji = useCallback((emoji: typeof moodEmojis[0]) => {
    if (filledEmojis.length >= 5) { toast({ title: "Bottle is full! 🧸", description: "Save or reset" }); return; }
    setFilledEmojis(prev => [...prev, emoji]);
    if (soundEnabled) playChime(400 + filledEmojis.length * 80, 0.3);
  }, [filledEmojis.length, soundEnabled]);

  const reset = () => { setFilledEmojis([]); if (soundEnabled) playChime(300, 0.5); };

  const save = async () => {
    if (!userId || filledEmojis.length === 0) return;
    setIsSaving(true);
    try {
      const avg = Math.round(filledEmojis.reduce((a, e) => a + e.score, 0) / filledEmojis.length);
      await supabase.from('mood_entries').insert({ user_id: userId, emojis: filledEmojis.map(e => e.emoji), mood_score: avg });
      toast({ title: "Mood saved! 🎀✨" });
      setFilledEmojis([]);
      if (soundEnabled) { playChime(523, 0.4); setTimeout(() => playChime(659, 0.4), 150); setTimeout(() => playChime(784, 0.5), 300); }
    } catch { toast({ title: "Oops! 😿", variant: "destructive" }); }
    setIsSaving(false);
  };

  const avgScore = filledEmojis.length > 0 ? filledEmojis.reduce((a, e) => a + e.score, 0) / filledEmojis.length : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, hsl(30 50% 96%) 0%, hsl(340 40% 94%) 50%, hsl(280 30% 95%) 100%)' }} />
      <CustomCursor /><FloatingHearts />
      <Link to="/home" className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30 text-foreground hover:bg-kawaii-blush/20 transition-colors"><ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back</span></Link>
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-kawaii-blush/30">{soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}<Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} className="data-[state=checked]:bg-kawaii-blush" /></div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Fill Your Mood Bottle 🫙</h1>
          <p className="text-muted-foreground">Tap 5 emojis to fill your bottle 💕</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-3xl p-6 bg-gradient-to-br from-kawaii-cream/60 to-kawaii-blush/40">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">How are you feeling?</h3>
            <div className="grid grid-cols-5 gap-3">{moodEmojis.map(e => <motion.button key={e.name} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => addEmoji(e)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-background/60 hover:bg-background/80 text-2xl" title={e.name}>{e.emoji}</motion.button>)}</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <CuteBottle filledEmojis={filledEmojis} />
            <p className="text-center mt-4 text-sm text-muted-foreground">{filledEmojis.length}/5 feelings</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center gap-6">
            <AnimatePresence>{filledEmojis.length > 0 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="glass-card rounded-2xl p-6 bg-gradient-to-br from-kawaii-lavender/40 to-kawaii-mint/40"><MoodStars score={avgScore} /></motion.div>}</AnimatePresence>
            <div className="flex flex-col gap-3 w-full">
              <Button onClick={save} disabled={filledEmojis.length === 0 || isSaving} className="kawaii-btn h-12 rounded-2xl bg-gradient-to-r from-kawaii-blush to-kawaii-lavender text-foreground font-semibold gap-2">{isSaving ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>✨</motion.span> : <><Save className="w-4 h-4" /> Save Mood</>}</Button>
              <Button onClick={reset} disabled={filledEmojis.length === 0} variant="outline" className="rounded-2xl border-kawaii-blush/30 gap-2"><RotateCcw className="w-4 h-4" /> Reset</Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MoodBottle;
