
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Grid, Briefcase, Mail, Settings, Layout } from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  const navItems = [
    { icon: <Home size={20} />, label: 'Home', href: '#home' },
    { icon: <Layout size={20} />, label: 'Work', href: '#work' },
    { icon: <Grid size={20} />, label: 'Services', href: '#services' },
    { icon: <Briefcase size={20} />, label: 'Experience', href: '#experience' },
    { icon: <Mail size={20} />, label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl"
      >
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 relative group"
          >
            {item.icon}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.label}
            </span>
          </a>
        ))}
        <div className="w-[1px] h-8 bg-white/10 mx-2" />
        <button
          onClick={onAdminClick}
          className="p-3 text-white/40 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-all duration-300"
        >
          <Settings size={20} />
        </button>
      </motion.nav>
    </div>
  );
};

export default Navbar;
