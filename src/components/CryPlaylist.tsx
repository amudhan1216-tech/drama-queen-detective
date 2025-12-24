import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sadSongs = [
  { title: "Why Did You Leave Me on Read", artist: "The Anxious Hearts", notes: [261.63, 246.94, 220, 196, 174.61] },
  { title: "Situationship Blues", artist: "Confused & Crying", notes: [293.66, 261.63, 246.94, 220, 196] },
  { title: "They Said 'K' and My Heart Shattered", artist: "Dramatic Tears", notes: [329.63, 293.66, 261.63, 246.94, 220] },
  { title: "3AM Thoughts About You", artist: "Sleepless Nights", notes: [349.23, 329.63, 293.66, 261.63, 246.94] },
  { title: "I Checked Their Instagram Story 47 Times", artist: "Stalker Era", notes: [392, 349.23, 329.63, 293.66, 261.63] },
  { title: "Maybe They're Just Busy (They're Not)", artist: "The Delusional", notes: [440, 392, 349.23, 329.63, 293.66] },
  { title: "Ghosted in the Moonlight", artist: "Disappeared Again", notes: [246.94, 220, 196, 174.61, 164.81] },
  { title: "One-Sided Effort Anthem", artist: "Lonely Hearts Club", notes: [293.66, 277.18, 261.63, 246.94, 233.08] },
  { title: "They Liked Someone Else's Photo", artist: "Digital Heartbreak", notes: [311.13, 293.66, 277.18, 261.63, 246.94] },
  { title: "When 'We Need to Talk' Hits", artist: "Anxiety Attack", notes: [369.99, 349.23, 329.63, 311.13, 293.66] },
];

export const CryPlaylist = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<typeof sadSongs[0] | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playNote = (frequency: number, duration: number, delay: number) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    const startTime = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const playSadMelody = (notes: number[]) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    // Play initial melody
    notes.forEach((note, index) => {
      playNote(note, 0.8, index * 0.6);
    });

    // Loop the melody
    intervalRef.current = setInterval(() => {
      if (audioContextRef.current) {
        notes.forEach((note, index) => {
          playNote(note, 0.8, index * 0.6);
        });
      }
    }, notes.length * 600 + 500);
  };

  const stopMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
      setIsPlaying(false);
    } else {
      const randomSong = sadSongs[Math.floor(Math.random() * sadSongs.length)];
      setCurrentSong(randomSong);
      playSadMelody(randomSong.notes);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-kawaii-lavender/40">
            <Music className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Cry Playlist</h3>
            <p className="text-sm text-muted-foreground">For the emotional moments</p>
          </div>
        </div>
        <Button
          onClick={togglePlay}
          size="icon"
          className="kawaii-btn rounded-full w-12 h-12 bg-gradient-to-r from-secondary to-kawaii-lavender"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </Button>
      </div>

      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-r from-kawaii-lavender/20 to-primary/10 border border-secondary/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Music className="w-6 h-6 text-primary-foreground" />
                  </div>
                  {isPlaying && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ border: '2px solid hsl(var(--primary) / 0.5)' }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{currentSong.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic text-center">
                {isPlaying ? '🎵 Playing sad melodies... 🎵' : '🎵 Paused 🎵'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
