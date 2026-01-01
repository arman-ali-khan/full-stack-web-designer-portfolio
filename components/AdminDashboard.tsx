import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Plus, Trash2, Save, LogOut, 
  Image as ImageIcon, Loader2, 
  Briefcase, Quote, Monitor, Home
} from 'lucide-react';
import { Project, Service, Experience, Testimonial, SiteSettings } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onClose: () => void;
  data: {
    projects: Project[];
    services: Service[];
    experience: Experience[];
    testimonials: Testimonial[];
    settings: SiteSettings | null;
  };
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'projects' | 'experience' | 'testimonials'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Local state for UI editing (not auto-saved)
  const [localSettings, setLocalSettings] = useState<SiteSettings>(data.settings || {
    hero_title: '', hero_subtitle: '', hero_description: '', contact_email: '', location: ''
  });
  const [localProjects, setLocalProjects] = useState<Project[]>(data.projects);
  const [localServices, setLocalServices] = useState<Service[]>(data.services);
  const [localExperience, setLocalExperience] = useState<Experience[]>(data.experience);
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>(data.testimonials);

  useEffect(() => {
    if (saveStatus !== 'idle') {
      const timer = setTimeout(() => setSaveStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      // 1. Settings
      await supabase.from('site_settings').upsert({ id: 1, ...localSettings });

      // 2. Collections (Batch upsert)
      if (localProjects.length > 0) {
        const projectsToSave = localProjects.map((p, i) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          image_url: p.imageUrl,
          tech_stack: p.techStack,
          link: p.link,
          order_index: i
        }));
        await supabase.from('projects').upsert(projectsToSave);
      }

      if (localServices.length > 0) {
        await supabase.from('services').upsert(localServices.map((s, i) => ({ ...s, order_index: i })));
      }

      if (localExperience.length > 0) {
        await supabase.from('experience').upsert(localExperience.map((e, i) => ({ ...e, order_index: i })));
      }

      if (localTestimonials.length > 0) {
        await supabase.from('testimonials').upsert(localTestimonials);
      }

      await onUpdate();
      setSaveStatus('success');
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  const addItem = (type: string) => {
    const newId = crypto.randomUUID();
    if (type === 'project') setLocalProjects([...localProjects, { id: newId, title: 'New Work', description: '', imageUrl: '', techStack: [], link: '' }]);
    if (type === 'service') setLocalServices([...localServices, { id: newId, title: 'New Service', description: '', icon_name: 'Monitor' }]);
    if (type === 'experience') setLocalExperience([...localExperience, { id: newId, role: 'New Role', company: '', period: '', description: '' }]);
    if (type === 'testimonial') setLocalTestimonials([...localTestimonials, { id: newId, author: 'New Person', text: '', role: '' }]);
  };

  const removeItem = async (type: string, id: string) => {
    if (!confirm('Permanently delete this item from the database?')) return;
    try {
      await supabase.from(type).delete().eq('id', id);
      if (type === 'projects') setLocalProjects(localProjects.filter(p => p.id !== id));
      if (type === 'services') setLocalServices(localServices.filter(s => s.id !== id));
      if (type === 'experience') setLocalExperience(localExperience.filter(e => e.id !== id));
      if (type === 'testimonials') setLocalTestimonials(localTestimonials.filter(t => t.id !== id));
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] overflow-hidden flex font-sans">
      <aside className="w-72 glass border-r border-white/10 flex flex-col p-6">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-black tracking-tighter text-purple-500">NEXUS_CORE</h1>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Management Interface</p>
        </div>

        <nav className="flex-1 space-y-2">
          <TabButton active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} icon={<Home size={18}/>} label="Hero & Global" />
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Monitor size={18}/>} label="Services" />
          <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Layout size={18}/>} label="Works" />
          <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={18}/>} label="Experience" />
          <TabButton active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} icon={<Quote size={18}/>} label="Testimonials" />
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg ${
              saveStatus === 'success' ? 'bg-green-500' : 
              saveStatus === 'error' ? 'bg-red-500' : 
              'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saveStatus === 'success' ? 'SYNCED' : saveStatus === 'error' ? 'RETRY' : 'SAVE CHANGES'}
          </button>
          
          <button onClick={onClose} className="w-full py-3 text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-mono">Exit</button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-400/50 hover:text-red-400 text-xs py-2"><LogOut size={14}/> Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'hero' && (
              <motion.div key="hero" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <SectionHeader title="HERO_CORE" subtitle="Main identity and messaging" />
                <div className="grid grid-cols-1 gap-6">
                  <Input label="Subtitle" value={localSettings.hero_subtitle} onChange={v => setLocalSettings({...localSettings, hero_subtitle: v})} />
                  <Input label="Main Title" value={localSettings.hero_title} onChange={v => setLocalSettings({...localSettings, hero_title: v})} />
                  <Textarea label="Description" value={localSettings.hero_description} onChange={v => setLocalSettings({...localSettings, hero_description: v})} />
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="Contact Email" value={localSettings.contact_email} onChange={v => setLocalSettings({...localSettings, contact_email: v})} />
                    <Input label="Location" value={localSettings.location} onChange={v => setLocalSettings({...localSettings, location: v})} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="SERVICES_MODULE" subtitle="What you offer" />
                  <button onClick={() => addItem('service')} className="p-2 glass rounded-xl text-purple-400 hover:bg-white/10"><Plus size={20}/></button>
                </div>
                <div className="space-y-4">
                  {localServices.map(s => (
                    <div key={s.id} className="glass p-6 rounded-3xl flex gap-6 items-start">
                      <div className="flex-1 space-y-4">
                        <Input label="Title" value={s.title} onChange={v => setLocalServices(localServices.map(i => i.id === s.id ? {...i, title: v} : i))} />
                        <Textarea label="Description" value={s.description} onChange={v => setLocalServices(localServices.map(i => i.id === s.id ? {...i, description: v} : i))} />
                      </div>
                      <button onClick={() => removeItem('services', s.id)} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="WORKS_CATALOG" subtitle="Portfolio items" />
                  <button onClick={() => addItem('project')} className="p-2 glass rounded-xl text-purple-400 hover:bg-white/10"><Plus size={20}/></button>
                </div>
                <div className="space-y-6">
                  {localProjects.map(p => (
                    <div key={p.id} className="glass p-6 rounded-3xl flex gap-8 items-start">
                      <div className="w-32 aspect-video glass rounded-xl overflow-hidden shrink-0">
                        {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" alt="Preview"/> : <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={24}/></div>}
                      </div>
                      <div className="flex-1 space-y-4">
                        <Input label="Title" value={p.title} onChange={v => setLocalProjects(localProjects.map(i => i.id === p.id ? {...i, title: v} : i))} />
                        <Input label="Image URL" value={p.imageUrl} onChange={v => setLocalProjects(localProjects.map(i => i.id === p.id ? {...i, imageUrl: v} : i))} />
                        <Input label="Link" value={p.link} onChange={v => setLocalProjects(localProjects.map(i => i.id === p.id ? {...i, link: v} : i))} />
                      </div>
                      <button onClick={() => removeItem('projects', p.id)} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'experience' && (
              <motion.div key="exp" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="JOURNEY_LOG" subtitle="Professional timeline" />
                  <button onClick={() => addItem('experience')} className="p-2 glass rounded-xl text-purple-400 hover:bg-white/10"><Plus size={20}/></button>
                </div>
                {localExperience.map(e => (
                  <div key={e.id} className="glass p-6 rounded-3xl flex gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Role" value={e.role} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, role: v} : i))} />
                        <Input label="Company" value={e.company} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, company: v} : i))} />
                      </div>
                      <Input label="Period" value={e.period} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, period: v} : i))} />
                      <Textarea label="Description" value={e.description} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, description: v} : i))} />
                    </div>
                    <button onClick={() => removeItem('experience', e.id)} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 size={18}/></button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'testimonials' && (
              <motion.div key="test" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="ECHO_FEEDBACK" subtitle="Client testimonials" />
                  <button onClick={() => addItem('testimonial')} className="p-2 glass rounded-xl text-purple-400 hover:bg-white/10"><Plus size={20}/></button>
                </div>
                {localTestimonials.map(t => (
                  <div key={t.id} className="glass p-6 rounded-3xl flex gap-6">
                    <div className="flex-1 space-y-4">
                      <Textarea label="Testimonial Text" value={t.text} onChange={v => setLocalTestimonials(localTestimonials.map(i => i.id === t.id ? {...i, text: v} : i))} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Author" value={t.author} onChange={v => setLocalTestimonials(localTestimonials.map(i => i.id === t.id ? {...i, author: v} : i))} />
                        <Input label="Role/Context" value={t.role} onChange={v => setLocalTestimonials(localTestimonials.map(i => i.id === t.id ? {...i, role: v} : i))} />
                      </div>
                    </div>
                    <button onClick={() => removeItem('testimonials', t.id)} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 size={18}/></button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${active ? 'bg-white/10 text-white border-white/10 border' : 'text-white/30 hover:text-white'}`}>
    {icon}
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const SectionHeader = ({ title, subtitle }: any) => (
  <div className="mb-8">
    <h2 className="text-3xl font-black tracking-tighter uppercase">{title}</h2>
    <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-mono">{subtitle}</p>
  </div>
);

const Input = ({ label, value, onChange }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">{label}</label>
    <input value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all font-sans text-sm" />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">{label}</label>
    <textarea rows={3} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all font-sans text-sm resize-none" />
  </div>
);

export default AdminDashboard;