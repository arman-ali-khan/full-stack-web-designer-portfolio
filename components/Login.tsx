
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLogin();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass w-full max-w-md p-10 rounded-[32px] border-white/10 relative"
      >
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-purple-400 mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-white/40 text-sm mt-2">Identify yourself to access Nexus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexus.design"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center font-mono uppercase tracking-widest">
              {error}
            </p>
          )}

          <button 
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "AUTHENTICATE"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
