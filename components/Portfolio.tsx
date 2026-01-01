
import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface PortfolioProps {
  projects: Project[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
  return (
    <section id="work" className="min-h-screen py-32 px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">SELECTED WORKS</h2>
        <p className="text-white/40 max-w-md italic font-light uppercase tracking-widest text-xs">
          A showcase of digital craftsmanship and problem solving.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="group relative"
          >
            <div className="aspect-[16/10] overflow-hidden rounded-3xl glass border-none">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="mt-8 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{project.title}</h3>
                <p className="text-white/50 text-sm max-w-sm mb-4">{project.description}</p>
                <div className="flex gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded-full text-white/40 uppercase">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <a 
                href={project.link}
                className="p-4 rounded-full glass hover:bg-white hover:text-black transition-all group-hover:rotate-45"
              >
                <ArrowUpRight size={24} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
