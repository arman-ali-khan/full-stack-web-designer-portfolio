
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import ExperienceTimeline from './components/ExperienceTimeline';
import TechStack from './components/TechStack';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Scene3D from './components/Scene3D';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import { Project, Service, Experience, Testimonial, Skill, SiteSettings } from './types';
import { supabase } from './lib/supabase';

// Fix: Bypassing missing JSX intrinsic element types for Three.js elements
const ThreeColor = 'color' as any;

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [needsInstall, setNeedsInstall] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [currentPath, setCurrentPath] = useState(() => {
    try { 
      return window.location.pathname; 
    } catch { 
      return '/'; 
    }
  });

  const navigateTo = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    
    // Auto-toggle admin state based on path
    if (path.startsWith('/admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setIsAdmin(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchAllContent = async () => {
    try {
      const [pRes, sRes, eRes, tRes, stRes, skRes] = await Promise.all([
        supabase.from('projects').select('*').order('order_index', { ascending: true }),
        supabase.from('services').select('*').order('order_index', { ascending: true }),
        supabase.from('experience').select('*').order('order_index', { ascending: true }),
        supabase.from('testimonials').select('*'),
        supabase.from('site_settings').select('*').single(),
        supabase.from('skills').select('*').order('order_index', { ascending: true })
      ]);

      if (pRes.data) setProjects(pRes.data.map(p => ({
        id: p.id, 
        title: p.title, 
        description: p.description, 
        imageUrl: p.image_url, 
        techStack: p.tech_stack || [], 
        link: p.link,
        previewUrl: p.preview_url
      })));
      if (sRes.data) setServices(sRes.data);
      if (eRes.data) setExperience(eRes.data);
      if (tRes.data) setTestimonials(tRes.data);
      if (stRes.data) setSettings(stRes.data);
      if (skRes.data) setSkills(skRes.data);
    } catch (e: any) {
      console.error('Nexus Init Error:', e.message);
    }
  };

  useEffect(() => {
    fetchAllContent();
    const init = async () => {
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      if (count === 0) {
        setNeedsInstall(true);
      } else {
        setNeedsInstall(false);
      }

      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // If user lands on /admin and is logged in, show dashboard
      if (currentPath.startsWith('/admin') && session) {
        setIsAdmin(true);
      } else if (currentPath.startsWith('/admin') && !session) {
        setShowLogin(true);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session && currentPath.startsWith('/admin')) {
        setIsAdmin(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminToggle = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigateTo('/');
      } else {
        navigateTo('/admin');
      }
    } else {
      setShowLogin(true);
    }
  };

  if (currentPath === '/install' && needsInstall) {
    return (
      <Register 
        isInstallMode 
        onComplete={() => { 
          setNeedsInstall(false); 
          fetchAllContent(); 
          navigateTo('/');
        }} 
      />
    );
  }

  if (isAdmin && isAuthenticated && currentPath.startsWith('/admin')) {
    return (
      <AdminDashboard 
        onClose={() => navigateTo('/')} 
        currentSubPath={currentPath}
        onNavigate={navigateTo}
        data={{ projects, services, experience, testimonials, settings, skills }}
        onUpdate={fetchAllContent}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#050505] selection:bg-purple-500/30">
      <Header onLoginClick={handleAdminToggle} isAuthenticated={isAuthenticated} settings={settings} />
      
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-0">
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
            <ThreeColor attach="background" args={['#050505']} />
            <ScrollControls pages={7} damping={0.2}>
              <Scene3D />
              <Scroll html>
                <div className="w-screen relative z-10 pointer-events-auto">
                  <Hero data={settings} skills={skills} />
                  <Services data={services} />
                  <Portfolio projects={projects} />
                  <ExperienceTimeline data={experience} />
                  <TechStack skills={skills} />
                  <Testimonials data={testimonials} />
                  <Contact data={settings} />
                  
                  <footer className="w-full py-20 px-10 flex flex-col md:flex-row justify-between items-center opacity-40 text-[10px] font-black tracking-[0.2em] border-t border-white/5 bg-black/50">
                    <p className="uppercase">{settings?.footer_copy || '© 2024 NEXUS DESIGN STUDIO'}</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                      {settings?.dribbble_url && <a href={settings.dribbble_url} className="hover:text-purple-400 transition-colors">DRIBBBLE</a>}
                      {settings?.twitter_url && <a href={settings.twitter_url} className="hover:text-purple-400 transition-colors">X_TWITTER</a>}
                      {settings?.linkedin_url && <a href={settings.linkedin_url} className="hover:text-purple-400 transition-colors">LINKEDIN</a>}
                    </div>
                  </footer>
                  <div className="h-24" />
                </div>
              </Scroll>
            </ScrollControls>
          </Canvas>
        </div>
      </Suspense>

      <Navbar onAdminClick={handleAdminToggle} />

      <AnimatePresence>
        {showLogin && (
          <Login 
            onLogin={() => { 
              setShowLogin(false); 
              navigateTo('/admin');
              fetchAllContent(); 
            }} 
            onCancel={() => {
              setShowLogin(false);
              if (currentPath.startsWith('/admin')) navigateTo('/');
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
