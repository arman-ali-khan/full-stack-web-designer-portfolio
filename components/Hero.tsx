import React from 'react';
import { motion } from 'framer-motion';
import { SiteSettings } from '../types';

interface HeroProps {
  data: SiteSettings | null;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  return (
    <section id="home" className="h-screen flex flex-col items-center justify-center px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <span className="text-purple-500 font-mono tracking-[0.3em] text-xs mb-4 block uppercase">
          {data?.hero_subtitle || 'Digital Architect & Interface Designer'}
        </span>
        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none mb-6">
          {data?.hero_title.split(' ').slice(0, 1) || 'CRAFTING'} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 bg-[length:200%_auto] animate-gradient">
            {data?.hero_title.split(' ').slice(1).join(' ') || 'DIGITAL REALMS'}
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-white/60 text-lg md:text-xl font-light leading-relaxed mb-10">
          {data?.hero_description || "Bridging the gap between minimalist aesthetics and high-performance Web3 interactions."}
        </p>
        
        <div className="flex gap-4 justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-purple-100 transition-colors"
          >
            EXPLORE WORK
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 glass text-white font-bold rounded-full"
          >
            LET'S TALK
          </motion.button>
        </div>
      </motion.div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] tracking-widest">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;