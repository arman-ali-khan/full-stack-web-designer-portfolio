import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { SiteSettings } from '../types';
import { supabase } from '../lib/supabase';

interface ContactProps {
  data: SiteSettings | null;
}

const Contact: React.FC<ContactProps> = ({ data }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);
      
      if (error) throw error;
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-32 px-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-tight uppercase tracking-tighter">
            INITIATE <br />
            <span className="text-white/20">CONTACT.</span>
          </h2>
          <p className="text-white/50 text-xl font-light mb-12 max-w-md italic">
            "Every significant bridge was built one interaction at a time."
          </p>
          
          <div className="space-y-8">
            <ContactInfo label="Secure Line" value={data?.contact_email || 'hello@nexus.design'} isEmail />
            <ContactInfo label="Node Location" value={data?.location || 'Remote / Global'} />
          </div>
        </div>

        <div className="glass p-12 rounded-[48px] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputBox label="Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="IDENTIFY YOURSELF" />
              <InputBox label="Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} placeholder="RETURN ADDR" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 ml-4">Transmission</label>
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                rows={5}
                placeholder="ENCODE MESSAGE..."
                className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all resize-none font-mono text-sm"
              />
            </div>

            <motion.button
              disabled={status === 'sending' || status === 'sent'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-6 rounded-[32px] font-black tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl ${
                status === 'sent' ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
              }`}
            >
              {status === 'idle' && <><Send size={18} /> SEND_DATA</>}
              {status === 'sending' && "UPLOADING..."}
              {status === 'sent' && <><CheckCircle size={18}/> DATA_STORED</>}
              {status === 'error' && "RETRY_TRANS"}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ label, value, isEmail }: any) => (
  <div>
    <p className="text-[9px] uppercase tracking-[0.4em] text-purple-500 mb-2 font-mono font-bold">{label}</p>
    {isEmail ? (
      <a href={`mailto:${value}`} className="text-2xl font-bold hover:text-purple-400 transition-colors uppercase tracking-tight">{value}</a>
    ) : (
      <p className="text-2xl font-bold uppercase tracking-tight">{value}</p>
    )}
  </div>
);

const InputBox = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 ml-4">{label}</label>
    <input 
      type={type} 
      required
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-[28px] p-5 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all font-mono text-xs"
    />
  </div>
);

export default Contact;