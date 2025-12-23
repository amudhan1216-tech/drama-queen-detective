import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sadSongs = [
  { title: "Why Did You Leave Me on Read", artist: "The Anxious Hearts" },
  { title: "Situationship Blues", artist: "Confused & Crying" },
  { title: "They Said 'K' and My Heart Shattered", artist: "Dramatic Tears" },
  { title: "3AM Thoughts About You", artist: "Sleepless Nights" },
  { title: "I Checked Their Instagram Story 47 Times", artist: "Stalker Era" },
  { title: "Maybe They're Just Busy (They're Not)", artist: "The Delusional" },
  { title: "Ghosted in the Moonlight", artist: "Disappeared Again" },
  { title: "One-Sided Effort Anthem", artist: "Lonely Hearts Club" },
  { title: "They Liked Someone Else's Photo", artist: "Digital Heartbreak" },
  { title: "When 'We Need to Talk' Hits", artist: "Anxiety Attack" },
];

export const CryPlaylist = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<typeof sadSongs[0] | null>(null);

  const playSadSong = () => {
    const randomSong = sadSongs[Math.floor(Math.random() * sadSongs.length)];
    setCurrentSong(randomSong);
    setIsPlaying(true);
  };

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
          onClick={playSadSong}
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
                🎵 Playing imaginary sad songs... 🎵
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
