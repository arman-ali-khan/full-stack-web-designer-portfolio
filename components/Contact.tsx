
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 2000);
  };

  return (
    <section id="contact" className="py-32 px-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-tight">
            LET'S SHAPE <br />
            <span className="text-white/20">THE FUTURE.</span>
          </h2>
          <p className="text-white/50 text-xl font-light mb-12 max-w-md">
            Whether you have a specific project in mind or just want to explore possibilities, I'm always open to new connections.
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-500 mb-2 font-mono">Email Me</p>
              <a href="mailto:hello@nexus.design" className="text-2xl font-bold hover:text-purple-400 transition-colors">hello@nexus.design</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-500 mb-2 font-mono">Location</p>
              <p className="text-2xl font-bold">Remote / Global</p>
            </div>
          </div>
        </div>

        <div className="glass p-10 rounded-[40px] border-white/5">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Message</label>
              <textarea 
                rows={5}
                required
                placeholder="Tell me about your vision..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            <motion.button
              disabled={status !== 'idle'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                status === 'sent' ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              {status === 'idle' && <><Send size={18} /> SEND MESSAGE</>}
              {status === 'sending' && "TRANSMITTING..."}
              {status === 'sent' && "MISSION COMPLETE"}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
