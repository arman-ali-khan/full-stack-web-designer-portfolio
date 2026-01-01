import React from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, Command } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, isAuthenticated }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-[60] px-8 py-6 flex justify-between items-center pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 pointer-events-auto group cursor-pointer"
      >
        <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-purple-500 border-white/20 group-hover:border-purple-500/50 transition-colors">
          <Command size={24} />
        </div>
        <span className="font-black text-xl tracking-tighter uppercase">Nexus</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto"
      >
        <button
          onClick={onLoginClick}
          className="glass px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest"
        >
          {isAuthenticated ? (
            <>
              <User size={14} className="text-purple-400" />
              Dashboard
            </>
          ) : (
            <>
              <LogIn size={14} className="text-cyan-400" />
              Login
            </>
          )}
        </button>
      </motion.div>
    </header>
  );
};

export default Header;