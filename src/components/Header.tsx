import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain } from 'lucide-react';

export const Header = () => {
  return (
    <header className="relative py-12 md:py-16 text-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-4xl"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌸
        </motion.div>
        <motion.div
          className="absolute top-20 right-16 text-3xl"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-1/4 text-3xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          💕
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-10 text-2xl"
          animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.7 }}
        >
          🦋
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* Logo/Icon */}
        <motion.div
          className="inline-flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-secondary to-kawaii-lavender flex items-center justify-center shadow-glow">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="sparkle-text">Overthink Palace</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 mb-6">
          Turn your anxiety into ✨aesthetic✨ content. 
          <br className="hidden md:block" />
          Because your spiral deserves to be pretty.
        </p>

        {/* Tagline badges */}
        <div className="flex flex-wrap justify-center gap-3 px-4">
          {['Chaotic', 'Dramatic', 'Comforting', 'Unhinged'].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground text-sm font-medium border border-primary/20"
            >
              {['💖', '🎭', '🫂', '🌀'][i]} {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </header>
  );
};
