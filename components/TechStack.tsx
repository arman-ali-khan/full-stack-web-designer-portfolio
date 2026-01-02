
import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '../types';

interface TechStackProps {
  skills: Skill[];
}

const TechStack: React.FC<TechStackProps> = ({ skills }) => {
  const displayTech = skills.length > 0 ? skills.map(s => s.name) : [
    "NEXT.JS", "TYPESCRIPT", "TAILWIND", "THREE.JS", 
    "FRAMER MOTION", "SUPABASE", "GLSL", "FIGMA"
  ];

  return (
    <section className="py-24 bg-black/40 backdrop-blur-md border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <div className="flex whitespace-nowrap overflow-hidden group">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-24 py-10"
        >
          {[...displayTech, ...displayTech, ...displayTech].map((item, idx) => (
            <span 
              key={idx} 
              className={`text-5xl md:text-8xl font-black transition-all cursor-default uppercase font-sans tracking-tighter ${
                idx % 2 === 0 ? 'text-white opacity-20 hover:opacity-100' : 'stroke-text opacity-10 hover:opacity-50'
              }`}
              style={idx % 2 !== 0 ? { WebkitTextStroke: '1px rgba(255,255,255,0.8)' } : {}}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 text-center opacity-20">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em]">Global_Protocol_Support</p>
      </div>

      <style>{`
        .stroke-text {
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
};

export default TechStack;
