import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

const Hero = () => {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-morphism text-xs font-medium text-premium-purple mb-6 border-premium-purple/20"
        >
          <Sparkles size={14} />
          <span>Elite Curation for Premium Lifestyles</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight"
        >
          Discover the Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-purple to-premium-pink">
            Affiliate Shopping
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Handpicked premium products from the world's leading marketplaces,
          delivered through an exquisite glassy interface. Secure, fast, and elegant.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" className="gap-2">
            Explore Collection <ArrowRight size={20} />
          </Button>
          <Button variant="glass" size="lg">
            How it works
          </Button>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-purple/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
    </div>
  );
};

export default Hero;
