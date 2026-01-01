
import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: "Senior Product Designer",
    company: "LUMINA TECH",
    period: "2022 - PRESENT",
    description: "Leading the design system initiative for high-performance SaaS platforms."
  },
  {
    role: "UI Engineer",
    company: "NEO WEB3",
    period: "2020 - 2022",
    description: "Engineered complex dashboard interfaces using React and Framer Motion."
  },
  {
    role: "Visual Designer",
    company: "CREATIVE HUB",
    period: "2018 - 2020",
    description: "Crafted brand identities and marketing experiences for digital-first startups."
  }
];

const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="min-h-screen py-32 px-10 relative">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">JOURNEY</h2>
          <div className="w-20 h-1 bg-cyan-500" />
        </div>

        <div className="relative border-l border-white/10 pl-10 space-y-24 py-10">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[54px] top-2 w-7 h-7 rounded-full glass border-white/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              </div>

              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                <h3 className="text-2xl font-bold">{exp.role}</h3>
                <span className="text-cyan-400 font-mono text-sm tracking-widest">{exp.period}</span>
              </div>
              <h4 className="text-white/60 font-medium mb-4">{exp.company}</h4>
              <p className="text-white/40 text-lg leading-relaxed italic">
                "{exp.description}"
              </p>
            </motion.div>
          ))}
          
          {/* Animated Line Extension */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-[-1px] top-0 w-[2px] bg-gradient-to-b from-cyan-500 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
