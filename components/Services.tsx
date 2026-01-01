import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Cpu, Layers } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  data: Service[];
}

const iconMap: Record<string, any> = {
  Monitor: Monitor,
  Smartphone: Smartphone,
  Cpu: Cpu,
  Layers: Layers
};

const Services: React.FC<ServicesProps> = ({ data }) => {
  const displayServices = data.length > 0 ? data : [
    { title: "UI/UX Architecture", description: "Designing intuitive interfaces that prioritize user flow.", icon_name: 'Monitor' },
    { title: "Web3 Interactions", description: "Creating immersive 3D experiences.", icon_name: 'Cpu' },
    { title: "Mobile First", description: "Stunning across all viewport sizes.", icon_name: 'Smartphone' },
    { title: "Brand Strategy", description: "Developing cohesive visual identities.", icon_name: 'Layers' }
  ];

  return (
    <section id="services" className="min-h-screen py-32 px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">EXPERTISE</h2>
          <div className="w-20 h-1 bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, idx) => {
            const IconComp = iconMap[service.icon_name] || Monitor;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-[32px] group cursor-default transition-all border-white/5 hover:border-white/20 hover:bg-white/5"
              >
                <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-colors">
                  <IconComp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;