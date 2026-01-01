import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, UserPlus, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onComplete: () => void;
  isInstallMode?: boolean;
}

const Register: React.FC<RegisterProps> = ({ onComplete, isInstallMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up user via Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      try {
        // 2. IMPORTANT: Manually insert into profiles table to satisfy App.tsx check
        // This is necessary if no DB trigger exists in Supabase to sync auth.users -> profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email
          });

        if (profileError && profileError.code !== '23505') { // Ignore unique constraint errors
          console.warn('Profile insertion warning:', profileError.message);
        }

        setSuccess(true);
        // Wait a moment so the user sees the success state
        setTimeout(() => {
          onComplete();
        }, 1500);
      } catch (err: any) {
        console.error('Registration profile error:', err);
        // Still proceed since the user is signed up
        setSuccess(true);
        setTimeout(() => onComplete(), 1500);
      }
    } else {
      setLoading(false);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center p-6">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[150px] pointer-events-none animate-pulse delay-700"></div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-10 rounded-[40px] border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
            {isInstallMode ? <ShieldAlert size={40} /> : <UserPlus size={40} />}
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            {isInstallMode ? "Install Nexus" : "Create Admin"}
          </h2>
          <p className="text-white/40 text-sm mt-3 leading-relaxed max-w-xs">
            {isInstallMode 
              ? "No administrator found. Create the primary account to initialize the system." 
              : "Register a new administrator for this instance."}
          </p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 flex flex-col items-center gap-4 text-green-400"
          >
            <CheckCircle size={64} className="animate-bounce" />
            <p className="font-bold tracking-widest uppercase">Initializing Interface...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-2">Secure Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexus.design"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-all font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-2">Master Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-all font-mono"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-mono"
              >
                {error.toUpperCase()}
              </motion.div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-100 transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "CREATE_SYSTEM_ADMIN"}
            </button>
            
            <p className="text-[9px] text-center text-white/20 uppercase tracking-widest">
              Nexus Environment v1.0.4 // Security Layer Active
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Register;