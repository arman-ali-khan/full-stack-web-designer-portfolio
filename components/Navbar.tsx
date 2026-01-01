import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Grid, Briefcase, Mail, Settings, Layout, Command } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NavbarItem } from '../types';

const iconMap: Record<string, any> = {
  Home, Layout, Grid: Layout, Briefcase, Mail, Settings, Command
};

interface NavbarProps {
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  const [items, setItems] = useState<NavbarItem[]>([]);

  useEffect(() => {
    const fetchNav = async () => {
      const { data } = await supabase.from('navbar_items').select('*').order('order_index', { ascending: true });
      if (data) setItems(data);
    };
    fetchNav();
  }, []);

  const displayItems = items.length > 0 ? items : [
    { id: '1', label: 'Home', href: '#home', icon_name: 'Home', order_index: 0 },
    { id: '2', label: 'Work', href: '#work', icon_name: 'Layout', order_index: 1 },
    { id: '3', label: 'Contact', href: '#contact', icon_name: 'Mail', order_index: 2 }
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-full px-6 py-3 flex items-center gap-2 shadow-2xl border-white/5"
      >
        {displayItems.map((item, idx) => {
          const Icon = iconMap[item.icon_name] || Home;
          return (
            <a
              key={item.id}
              href={item.href}
              className="p-3 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 relative group"
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap scale-90 group-hover:scale-100 pointer-events-none border-white/10">
                {item.label}
              </span>
            </a>
          );
        })}
        <div className="w-[1px] h-6 bg-white/10 mx-2" />
        <button
          onClick={onAdminClick}
          className="p-3 text-white/30 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-all duration-300"
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      </motion.nav>
    </div>
  );
};

export default Navbar;