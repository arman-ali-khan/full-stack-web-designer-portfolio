
import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Cpu, Layers } from 'lucide-react';

const services = [
  {
    icon: <Monitor className="text-purple-400" />,
    title: "UI/UX Architecture",
    description: "Designing intuitive interfaces that prioritize user flow and minimalist aesthetics."
  },
  {
    icon: <Cpu className="text-cyan-400" />,
    title: "Web3 Interactions",
    description: "Creating immersive 3D experiences without the complexity of traditional tech stacks."
  },
  {
    icon: <Smartphone className="text-pink-400" />,
    title: "Mobile First",
    description: "Ensuring your digital identity remains stunning across all viewport sizes and devices."
  },
  {
    icon: <Layers className="text-indigo-400" />,
    title: "Brand Strategy",
    description: "Developing cohesive visual identities that resonate with modern digital audiences."
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="min-h-screen py-32 px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">EXPERTISE</h2>
          <div className="w-20 h-1 bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl group cursor-default transition-all border-white/5 hover:border-white/20 hover:bg-white/5"
            >
              <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
