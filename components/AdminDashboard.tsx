
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Plus, Trash2, Save, LogOut, 
  Image as ImageIcon, Loader2, 
  Briefcase, Quote, Monitor, Home, Zap,
  CheckCircle2, Upload, ExternalLink, Eye,
  Smartphone, Cpu, Layers, Code, 
  PenTool, Globe, Shield, Database, 
  Cloud, Terminal, Palette, Search, 
  Rocket, MessageSquare, Share2, Link as LinkIcon,
  Compass, Mail, Settings, Grid, ChevronRight
} from 'lucide-react';
import { Project, Service, Experience, Testimonial, Skill, SiteSettings, NavbarItem, ContactMessage } from '../types';
import { supabase } from '../lib/supabase';

const CLOUDINARY_CLOUD_NAME = 'dcckbmhft'; 
const CLOUDINARY_UPLOAD_PRESET = 'aistudio'; 

const AVAILABLE_ICONS = [
  'Home', 'Layout', 'Grid', 'Briefcase', 'Mail', 'Monitor', 'Smartphone', 'Cpu', 'Layers', 'Code', 
  'PenTool', 'Globe', 'Zap', 'Shield', 'Database', 'Cloud', 'Terminal', 'Palette', 'Search', 'Rocket'
];

const iconComponentMap: Record<string, any> = {
  Home, Layout, Grid, Briefcase, Mail, Monitor, Smartphone, Cpu, Layers, Code, 
  PenTool, Globe, Zap, Shield, Database, Cloud, Terminal, Palette, Search, Rocket, MessageSquare, Share2, Link: LinkIcon
};

type TabType = 'hero' | 'services' | 'projects' | 'experience' | 'testimonials' | 'skills' | 'nav' | 'messages';

interface AdminDashboardProps {
  onClose: () => void;
  currentSubPath: string;
  onNavigate: (path: string) => void;
  data: {
    projects: Project[];
    services: Service[];
    experience: Experience[];
    testimonials: Testimonial[];
    settings: SiteSettings | null;
    skills: Skill[];
  };
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, currentSubPath, onNavigate, data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const [localSettings, setLocalSettings] = useState<SiteSettings>(data.settings || {
    hero_title: '', hero_subtitle: '', hero_description: '', contact_email: '', location: '',
    site_name: 'NEXUS', footer_copy: '', twitter_url: '', dribbble_url: '', linkedin_url: ''
  });
  const [localProjects, setLocalProjects] = useState<Project[]>(data.projects);
  const [localServices, setLocalServices] = useState<Service[]>(data.services);
  const [localExperience, setLocalExperience] = useState<Experience[]>(data.experience);
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>(data.testimonials);
  const [localSkills, setLocalSkills] = useState<Skill[]>(data.skills);
  const [localNav, setLocalNav] = useState<NavbarItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Sync activeTab with URL
  useEffect(() => {
    const tabFromPath = currentSubPath.split('/')[2] as TabType;
    if (tabFromPath && ['hero', 'services', 'projects', 'experience', 'testimonials', 'skills', 'nav', 'messages'].includes(tabFromPath)) {
      setActiveTab(tabFromPath);
    } else {
      setActiveTab('hero');
    }
  }, [currentSubPath]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    onNavigate(`/admin/${tab}`);
  };

  useEffect(() => {
    fetchNavAndMessages();
  }, []);

  const fetchNavAndMessages = async () => {
    const { data: navData } = await supabase.from('navbar_items').select('*').order('order_index', { ascending: true });
    if (navData) setLocalNav(navData);
    
    const { data: msgData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (msgData) setMessages(msgData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(projectId);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const resData = await response.json();
      setLocalProjects(prev => prev.map(p => p.id === projectId ? { ...p, imageUrl: resData.secure_url } : p));
    } catch (err: any) {
      setErrorMessage(`Upload failed: ${err.message}`);
      setSaveStatus('error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await supabase.from('site_settings').upsert({ id: 1, ...localSettings });
      
      if (localNav.length > 0) {
        const navToUpsert = localNav.map((item, i) => ({ ...item, order_index: i }));
        await supabase.from('navbar_items').upsert(navToUpsert);
      }

      const projectsToUpsert = localProjects.map((p, i) => ({
        id: p.id, 
        title: p.title, 
        description: p.description, 
        image_url: p.imageUrl, 
        tech_stack: p.techStack || [], 
        link: p.link,
        preview_url: p.previewUrl,
        order_index: i
      }));
      if (projectsToUpsert.length > 0) await supabase.from('projects').upsert(projectsToUpsert);

      const servicesToUpsert = localServices.map((s, i) => ({
        id: s.id, title: s.title, description: s.description, icon_name: s.icon_name, order_index: i
      }));
      if (servicesToUpsert.length > 0) await supabase.from('services').upsert(servicesToUpsert);

      const skillsToUpsert = localSkills.map((s, i) => ({
        id: s.id, name: s.name, order_index: i
      }));
      if (skillsToUpsert.length > 0) await supabase.from('skills').upsert(skillsToUpsert);

      const expToUpsert = localExperience.map((e, i) => ({
        id: e.id, role: e.role, company: e.company, period: e.period, description: e.description, order_index: i
      }));
      if (expToUpsert.length > 0) await supabase.from('experience').upsert(expToUpsert);

      if (localTestimonials.length > 0) await supabase.from('testimonials').upsert(localTestimonials);

      await onUpdate();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setErrorMessage(err.message);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = (type: string) => {
    const newId = crypto.randomUUID();
    if (type === 'nav') setLocalNav([...localNav, { id: newId, label: 'New Link', href: '#', icon_name: 'Home', order_index: localNav.length }]);
    if (type === 'project') setLocalProjects([...localProjects, { id: newId, title: 'New Work', description: '', imageUrl: '', techStack: [], link: '', previewUrl: '' }]);
    if (type === 'service') setLocalServices([...localServices, { id: newId, title: 'New Service', description: '', icon_name: 'Monitor' }]);
    if (type === 'skill') setLocalSkills([...localSkills, { id: newId, name: 'New Tech', order_index: localSkills.length }]);
    if (type === 'experience') setLocalExperience([...localExperience, { id: newId, role: 'New Role', company: 'New Co', period: '2024', description: 'Description' }]);
    if (type === 'testimonial') setLocalTestimonials([...localTestimonials, { id: newId, author: 'New Person', role: 'Context', text: 'Feedback' }]);
  };

  const removeItem = async (type: string, dbTable: string, id: string) => {
    if (!confirm('Permanently delete from database?')) return;
    const { error } = await supabase.from(dbTable).delete().eq('id', id);
    if (!error) {
      if (type === 'nav') setLocalNav(localNav.filter(n => n.id !== id));
      if (type === 'projects') setLocalProjects(localProjects.filter(p => p.id !== id));
      if (type === 'services') setLocalServices(localServices.filter(s => s.id !== id));
      if (type === 'skills') setLocalSkills(localSkills.filter(s => s.id !== id));
      if (type === 'experience') setLocalExperience(localExperience.filter(e => e.id !== id));
      if (type === 'testimonials') setLocalTestimonials(localTestimonials.filter(t => t.id !== id));
      if (type === 'messages') setMessages(messages.filter(m => m.id !== id));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] overflow-hidden flex font-sans">
      <aside className="w-72 glass border-r border-white/10 flex flex-col p-6">
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center font-black text-xs italic">N</div>
          <div>
            <h1 className="text-sm font-black tracking-tighter text-white">CORE_MANAGEMENT</h1>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Nexus Protocol</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scroll">
          <TabButton active={activeTab === 'hero'} onClick={() => handleTabChange('hero')} icon={<Home size={16}/>} label="Branding" />
          <TabButton active={activeTab === 'nav'} onClick={() => handleTabChange('nav')} icon={<Compass size={16}/>} label="Navigation" />
          <TabButton active={activeTab === 'projects'} onClick={() => handleTabChange('projects')} icon={<Layout size={16}/>} label="Works" />
          <TabButton active={activeTab === 'services'} onClick={() => handleTabChange('services')} icon={<Monitor size={16}/>} label="Services" />
          <TabButton active={activeTab === 'skills'} onClick={() => handleTabChange('skills')} icon={<Zap size={16}/>} label="Tech Stack" />
          <TabButton active={activeTab === 'experience'} onClick={() => handleTabChange('experience')} icon={<Briefcase size={16}/>} label="Journey" />
          <TabButton active={activeTab === 'testimonials'} onClick={() => handleTabChange('testimonials')} icon={<Quote size={16}/>} label="Echo" />
          <div className="h-4" />
          <TabButton active={activeTab === 'messages'} onClick={() => handleTabChange('messages')} icon={<Mail size={16}/>} label="Inbox" count={messages.length} />
        </nav>

        <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
          <button onClick={handleSave} disabled={isSaving} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all ${saveStatus === 'success' ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saveStatus === 'success' ? 'SYNCED' : 'SAVE CHANGES'}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-400/50 hover:text-red-400 text-[10px] py-2 uppercase font-mono"><LogOut size={14}/> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'hero' && (
              <motion.div key="hero" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-10">
                <SectionHeader title="BRAND_CORE" subtitle="Identity and global settings" />
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Site Name" value={localSettings.site_name} onChange={v => setLocalSettings({...localSettings, site_name: v})} />
                  <Input label="Subtitle" value={localSettings.hero_subtitle} onChange={v => setLocalSettings({...localSettings, hero_subtitle: v})} />
                </div>
                <Input label="Hero Title" value={localSettings.hero_title} onChange={v => setLocalSettings({...localSettings, hero_title: v})} />
                <Textarea label="Hero Description" value={localSettings.hero_description} onChange={v => setLocalSettings({...localSettings, hero_description: v})} />
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Email" value={localSettings.contact_email} onChange={v => setLocalSettings({...localSettings, contact_email: v})} />
                  <Input label="Location" value={localSettings.location} onChange={v => setLocalSettings({...localSettings, location: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'nav' && (
              <motion.div key="nav" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="NAV_SYSTEM" subtitle="Manage navigation protocol" />
                  <button onClick={() => addItem('nav')} className="p-2 glass rounded-xl text-purple-400"><Plus size={20}/></button>
                </div>
                <div className="space-y-4">
                  {localNav.map(item => (
                    <div key={item.id} className="glass p-6 rounded-3xl flex gap-6 items-center">
                      <div className="flex flex-wrap gap-2 w-32">
                        {AVAILABLE_ICONS.slice(0, 10).map(i => {
                          const Icon = iconComponentMap[i] || Home;
                          return (
                            <button key={i} onClick={() => setLocalNav(localNav.map(n => n.id === item.id ? {...n, icon_name: i} : n))}
                              className={`p-1.5 rounded-lg ${item.icon_name === i ? 'bg-purple-600' : 'bg-white/5'}`}>
                              <Icon size={12} />
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <Input label="Label" value={item.label} onChange={v => setLocalNav(localNav.map(n => n.id === item.id ? {...n, label: v} : n))} />
                        <Input label="Href" value={item.href} onChange={v => setLocalNav(localNav.map(n => n.id === item.id ? {...n, href: v} : n))} />
                      </div>
                      <button onClick={() => removeItem('nav', 'navbar_items', item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="WORKS_CATALOG" subtitle="Portfolio catalog" />
                  <button onClick={() => addItem('project')} className="p-2 glass rounded-xl text-purple-400"><Plus size={20}/></button>
                </div>
                {localProjects.map(p => (
                  <div key={p.id} className="glass p-6 rounded-3xl flex flex-col md:flex-row gap-8 relative group">
                    <div className="w-full md:w-48 space-y-4">
                      <div onClick={() => document.getElementById(`upload-${p.id}`)?.click()} className="w-full aspect-video glass rounded-xl overflow-hidden relative cursor-pointer border-dashed border-2 border-white/10 flex items-center justify-center group/thumb">
                        {uploadingId === p.id ? <Loader2 className="animate-spin text-purple-500" /> : p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-white/10" />}
                        <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center"><Upload size={20} /></div>
                      </div>
                      <input id={`upload-${p.id}`} type="file" className="hidden" onChange={(e) => handleFileUpload(e, p.id)} />
                      
                      <div className="grid grid-cols-2 gap-2">
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2 text-[8px] uppercase tracking-tighter font-mono text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <ExternalLink size={10} /> Site
                          </a>
                        )}
                        {p.previewUrl && (
                          <a href={p.previewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2 text-[8px] uppercase tracking-tighter font-mono text-cyan-400 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 transition-colors">
                            <Eye size={10} /> Preview
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Input label="Title" value={p.title} onChange={v => setLocalProjects(localProjects.map(i => i.id === p.id ? {...i, title: v} : i))} />
                        <Input label="Project URL" value={p.link} placeholder="https://..." onChange={v => setLocalProjects(localProjects.map(i => i.id === p.id ? {...i, link: v} : i))} />
                        <Input label="Preview URL" value={p.previewUrl} placeholder="Optional demo link..." onChange={v => setLocalProjects(localProjects.map(i => i.id === p.id ? {...i, previewUrl: v} : i))} />
                      </div>
                      <Textarea label="Description" value={p.description} onChange={v => setLocalProjects(localProjects.map(i => i.id === p.id ? {...i, description: v} : i))} />
                    </div>
                    <button onClick={() => removeItem('projects', 'projects', p.id)} className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="SERVICES_MOD" subtitle="Expertise domains" />
                  <button onClick={() => addItem('service')} className="p-2 glass rounded-xl text-purple-400"><Plus size={20}/></button>
                </div>
                {localServices.map(s => (
                  <div key={s.id} className="glass p-6 rounded-3xl flex gap-6 relative group">
                    <div className="w-24 grid grid-cols-3 gap-1 h-fit">
                      {AVAILABLE_ICONS.slice(5, 14).map(i => {
                        const Icon = iconComponentMap[i] || Monitor;
                        return (
                          <button key={i} onClick={() => setLocalServices(localServices.map(item => item.id === s.id ? {...item, icon_name: i} : item))}
                            className={`p-1 rounded ${s.icon_name === i ? 'bg-purple-600' : 'bg-white/5'}`}><Icon size={12} /></button>
                        );
                      })}
                    </div>
                    <div className="flex-1 space-y-4">
                      <Input label="Service Title" value={s.title} onChange={v => setLocalServices(localServices.map(i => i.id === s.id ? {...i, title: v} : i))} />
                      <Textarea label="Description" value={s.description} onChange={v => setLocalServices(localServices.map(i => i.id === s.id ? {...i, description: v} : i))} />
                    </div>
                    <button onClick={() => removeItem('services', 'services', s.id)} className="p-2 text-red-400"><Trash2 size={16}/></button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div key="skills" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="TECH_STACK" subtitle="Core technologies" />
                  <button onClick={() => addItem('skill')} className="p-2 glass rounded-xl text-purple-400"><Plus size={20}/></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {localSkills.map((s, idx) => (
                    <div key={s.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                      <Input label={`Skill #${idx+1}`} value={s.name} onChange={v => setLocalSkills(localSkills.map(i => i.id === s.id ? {...i, name: v} : i))} />
                      <button onClick={() => removeItem('skills', 'skills', s.id)} className="mt-5 text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'experience' && (
              <motion.div key="exp" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="JOURNEY_LOG" subtitle="Timeline of experience" />
                  <button onClick={() => addItem('experience')} className="p-2 glass rounded-xl text-purple-400"><Plus size={20}/></button>
                </div>
                {localExperience.map(e => (
                  <div key={e.id} className="glass p-6 rounded-3xl space-y-4 relative group">
                    <div className="grid grid-cols-3 gap-4">
                      <Input label="Role" value={e.role} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, role: v} : i))} />
                      <Input label="Company" value={e.company} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, company: v} : i))} />
                      <Input label="Period" value={e.period} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, period: v} : i))} />
                    </div>
                    <Textarea label="Experience Details" value={e.description} onChange={v => setLocalExperience(localExperience.map(i => i.id === e.id ? {...i, description: v} : i))} />
                    <button onClick={() => removeItem('experience', 'experience', e.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'testimonials' && (
              <motion.div key="test" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <div className="flex justify-between items-center">
                  <SectionHeader title="ECHO_FEEDBACK" subtitle="Client voices" />
                  <button onClick={() => addItem('testimonial')} className="p-2 glass rounded-xl text-purple-400"><Plus size={20}/></button>
                </div>
                {localTestimonials.map(t => (
                  <div key={t.id} className="glass p-6 rounded-3xl space-y-4 relative group">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Author" value={t.author} onChange={v => setLocalTestimonials(localTestimonials.map(i => i.id === t.id ? {...i, author: v} : i))} />
                      <Input label="Context / Role" value={t.role} onChange={v => setLocalTestimonials(localTestimonials.map(i => i.id === t.id ? {...i, role: v} : i))} />
                    </div>
                    <Textarea label="Testimonial" value={t.text} onChange={v => setLocalTestimonials(localTestimonials.map(i => i.id === t.id ? {...i, text: v} : i))} />
                    <button onClick={() => removeItem('testimonials', 'testimonials', t.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div key="messages" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                <SectionHeader title="MESSAGE_LOG" subtitle="Incoming transmissions" />
                <div className="space-y-4">
                  {messages.length === 0 && <p className="text-white/20 italic">No messages found.</p>}
                  {messages.map(msg => (
                    <div key={msg.id} className="glass p-8 rounded-[32px] relative group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold">{msg.name}</h4>
                          <p className="text-purple-400 text-[10px] font-mono">{msg.email}</p>
                        </div>
                        <span className="text-[10px] text-white/20 font-mono uppercase">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-white/60 italic leading-relaxed">"{msg.message}"</p>
                      <button onClick={() => removeItem('messages', 'contact_messages', msg.id)} className="absolute top-4 right-4 p-2 text-red-400/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count }: any) => (
  <button onClick={onClick} className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${active ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>
    {icon}
    <span className="text-[11px] font-bold uppercase tracking-widest flex-1 text-left">{label}</span>
    {count > 0 && <span className="bg-purple-600 text-white text-[9px] px-2 py-0.5 rounded-full">{count}</span>}
  </button>
);

const SectionHeader = ({ title, subtitle }: any) => (
  <div className="mb-8">
    <h2 className="text-2xl font-black tracking-tighter uppercase text-white">{title}</h2>
    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1 font-mono">{subtitle}</p>
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 ml-2">{label}</label>
    <input type={type} value={value || ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 font-sans text-sm" />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 ml-2">{label}</label>
    <textarea rows={3} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 font-sans text-sm resize-none" />
  </div>
);

export default AdminDashboard;
