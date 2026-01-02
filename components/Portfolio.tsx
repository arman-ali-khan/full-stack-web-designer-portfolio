
import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight, Eye } from 'lucide-react';

interface PortfolioProps {
  projects: Project[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
  return (
    <section id="work" className="min-h-screen py-32 px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">SELECTED WORKS</h2>
        <p className="text-white/40 max-w-md italic font-light uppercase tracking-widest text-[10px]">
          A showcase of digital craftsmanship and modular problem solving.
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
            <div className="aspect-[16/10] overflow-hidden rounded-[40px] glass border-none relative">
              <img 
                src={project.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'} 
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Interactive Case Study</span>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-2xl font-bold group-hover:text-purple-400 transition-colors uppercase tracking-tight">{project.title}</h3>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <p className="text-white/50 text-sm max-w-sm mb-6 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="text-[9px] font-mono border border-white/10 px-3 py-1 rounded-full text-white/30 uppercase tracking-widest bg-white/5">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="ml-6 flex items-start gap-4">
                {project.previewUrl && (
                  <div className="flex flex-col items-center gap-3">
                    <a 
                      href={project.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-full glass border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-2xl shadow-cyan-500/0 hover:shadow-cyan-500/20"
                    >
                      <Eye size={22} />
                    </a>
                    <span className="text-[8px] font-black tracking-widest text-cyan-400/50 uppercase">Preview</span>
                  </div>
                )}
                
                {project.link && (
                  <div className="flex flex-col items-center gap-3">
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-full glass border border-purple-500/20 text-purple-400 hover:bg-white hover:text-black transition-all group-hover:rotate-45 shadow-2xl shadow-purple-500/0 hover:shadow-purple-500/20"
                    >
                      <ArrowUpRight size={22} />
                    </a>
                    <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">Visit</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
