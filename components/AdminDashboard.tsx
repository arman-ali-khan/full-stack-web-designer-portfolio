
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Plus, Trash2, Save, LogOut, Settings, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Project } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onClose: () => void;
  projects: Project[];
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, projects, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
  const [busy, setBusy] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  const addProject = async () => {
    setBusy('adding');
    const { error } = await supabase.from('projects').insert({
      title: 'New Creative Piece',
      description: 'Brief project overview goes here.',
      image_url: 'https://picsum.photos/800/600',
      tech_stack: ['React'],
      link: '#'
    });
    
    if (error) alert(error.message);
    else onUpdate();
    setBusy(null);
  };

  const removeProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    setBusy(id);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    
    if (error) alert(error.message);
    else onUpdate();
    setBusy(null);
  };

  const updateProjectField = async (id: string, field: string, value: any) => {
    // Map frontend field names to Supabase column names
    const dbField = field === 'imageUrl' ? 'image_url' : field === 'techStack' ? 'tech_stack' : field;
    
    const { error } = await supabase
      .from('projects')
      .update({ [dbField]: value })
      .eq('id', id);

    if (error) console.error(error.message);
    else onUpdate();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] overflow-hidden flex flex-col font-sans">
      <div className="glass h-20 border-b border-white/10 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-black tracking-tighter">NEXUS CONTROL</h1>
          <nav className="flex gap-4">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'projects' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Layout size={18} /> Projects
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Settings size={18} /> Global
            </button>
          </nav>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <Save size={18} /> EXIT_DASHBOARD
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2"
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'projects' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">MANAGE_WORKS</h2>
                <button 
                  disabled={!!busy}
                  onClick={addProject}
                  className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all disabled:opacity-50"
                >
                  {busy === 'adding' ? <Loader2 className="animate-spin" /> : <Plus size={20} />} NEW_PROJECT
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {projects.map((project) => (
                  <motion.div 
                    layout
                    key={project.id}
                    className="glass p-6 rounded-3xl border-white/5 flex gap-8 items-start"
                  >
                    <div className="w-48 aspect-video rounded-xl overflow-hidden glass relative group shrink-0">
                      <img src={project.imageUrl} className="w-full h-full object-cover opacity-80" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xl font-bold focus:border-purple-500 outline-none"
                        value={project.title}
                        onChange={(e) => updateProjectField(project.id, 'title', e.target.value)}
                      />
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/60 focus:border-purple-500 outline-none resize-none"
                        value={project.description}
                        rows={2}
                        onChange={(e) => updateProjectField(project.id, 'description', e.target.value)}
                      />
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase text-white/40 block mb-1 ml-2">Image URL</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs focus:border-purple-500 outline-none"
                            value={project.imageUrl}
                            onChange={(e) => updateProjectField(project.id, 'imageUrl', e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] uppercase text-white/40 block mb-1 ml-2">Project Link</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs focus:border-purple-500 outline-none"
                            value={project.link}
                            onChange={(e) => updateProjectField(project.id, 'link', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        disabled={busy === project.id}
                        onClick={() => removeProject(project.id)}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {busy === project.id ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass p-10 rounded-[40px] border-white/5 space-y-10 text-center py-40">
              <Settings className="mx-auto mb-4 text-purple-400" size={48} />
              <h2 className="text-3xl font-bold uppercase tracking-tighter">GLOBAL_CORE_SETTINGS</h2>
              <p className="text-white/40 max-w-sm mx-auto">Module integration in progress. Use the site_settings table in Supabase to manage global variables.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
