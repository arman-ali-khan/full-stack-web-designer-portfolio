import React from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, Command } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
  settings: SiteSettings | null;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, isAuthenticated, settings }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-[60] px-10 py-8 flex justify-between items-center pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 pointer-events-auto group cursor-pointer"
      >
        <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-purple-500 border-white/20 group-hover:border-purple-500/50 transition-all duration-500 group-hover:rotate-[360deg]">
          <Command size={22} />
        </div>
        <span className="font-black text-2xl tracking-tighter uppercase italic group-hover:text-purple-400 transition-colors">
          {settings?.site_name || 'NEXUS'}
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto"
      >
        <button
          onClick={onLoginClick}
          className="glass px-8 py-3 rounded-full flex items-center gap-3 hover:bg-white/10 transition-all border-white/5 hover:border-white/20 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          {isAuthenticated ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              PORTAL_READY
            </>
          ) : (
            <>
              <LogIn size={14} className="text-cyan-400" />
              AUTH_ACCESS
            </>
          )}
        </button>
      </motion.div>
    </header>
  );
};

export default Header;