
import React from 'react';
import { motion } from 'framer-motion';

const tech = [
  "NEXT.JS", "TYPESCRIPT", "TAILWIND", "THREE.JS", 
  "FRAMER MOTION", "SUPABASE", "GLSL", "FIGMA",
  "REACT", "D3.JS", "POSTGRESQL", "DOCKER"
];

const TechStack: React.FC = () => {
  return (
    <section className="py-20 bg-white/5 backdrop-blur-sm border-y border-white/5 relative overflow-hidden">
      <div className="flex whitespace-nowrap overflow-hidden group">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-20 py-10"
        >
          {[...tech, ...tech, ...tech].map((item, idx) => (
            <span 
              key={idx} 
              className="text-4xl md:text-6xl font-black text-transparent stroke-text opacity-20 hover:opacity-100 hover:text-white transition-all cursor-default"
              style={{
                WebkitTextStroke: '1px rgba(255,255,255,0.5)'
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>
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
