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
import Testimonials from './components/Testimonials';
import TechStack from './components/TechStack';
import Contact from './components/Contact';
import Scene3D from './components/Scene3D';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import { Project } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [needsInstall, setNeedsInstall] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => {
    try {
      return window.location.pathname;
    } catch {
      return '/';
    }
  });

  const safeUpdateHistory = (path: string, type: 'push' | 'replace' = 'push') => {
    try {
      if (type === 'push') {
        window.history.pushState({}, '', path);
      } else {
        window.history.replaceState({}, '', path);
      }
    } catch (e) {
      console.warn(`Nexus Navigation: History ${type} blocked. Using state fallback.`, e);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Fetch projects immediately to populate the landing page
      fetchProjects();

      try {
        const { count, error: profileError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        const tableNotFound = profileError && (profileError.code === '42P01');
        const isFreshInstall = tableNotFound || (count === 0 && !profileError);
        
        setNeedsInstall(!!isFreshInstall);

        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (currentPath.includes('/admin') && session) {
          setIsAdmin(true);
        }

        setIsInitialCheckDone(true);
      } catch (err: any) {
        console.error('Nexus Init Error:', err.message);
        setIsInitialCheckDone(true);
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) setIsAdmin(false);
    });

    const handlePopState = () => {
      try {
        setCurrentPath(window.location.pathname);
      } catch {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const mappedProjects: Project[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          imageUrl: p.image_url || 'https://picsum.photos/800/600',
          techStack: p.tech_stack || [],
          link: p.link || '#'
        }));
        setProjects(mappedProjects);
      }
    } catch (e: any) {
      console.error('Nexus Data Fetch Exception:', e.message);
    }
  };

  const handleAdminToggle = () => {
    if (isAuthenticated) {
      const nextAdminState = !isAdmin;
      setIsAdmin(nextAdminState);
      const path = nextAdminState ? '/admin' : '/';
      safeUpdateHistory(path);
      setCurrentPath(path);
    } else {
      setShowLogin(true);
    }
  };

  // Only show register if path is /install AND database has no users
  if (currentPath.includes('/install') && needsInstall) {
    return (
      <Register 
        isInstallMode={true}
        onComplete={() => { 
          setNeedsInstall(false); 
          setIsAdmin(true); 
          safeUpdateHistory('/admin', 'replace');
          setCurrentPath('/admin');
          fetchProjects();
        }} 
      />
    );
  }

  if (isAdmin && isAuthenticated) {
    return (
      <AdminDashboard 
        onClose={() => {
          setIsAdmin(false);
          safeUpdateHistory('/');
          setCurrentPath('/');
        }} 
        projects={projects} 
        onUpdate={fetchProjects}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#050505] selection:bg-purple-500/30">
      <Header onLoginClick={handleAdminToggle} isAuthenticated={isAuthenticated} />
      
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-0">
          <Canvas 
            shadows 
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true }}
          >
            <color attach="background" args={['#050505']} />
            <ScrollControls pages={7} damping={0.2}>
              <Scene3D />
              <Scroll html>
                <div className="w-screen relative z-10 pointer-events-auto">
                  <Hero />
                  <Services />
                  <Portfolio projects={projects} />
                  <ExperienceTimeline />
                  <TechStack />
                  <Testimonials />
                  <Contact />
                  
                  <footer className="w-full py-20 px-10 flex flex-col md:flex-row justify-between items-center opacity-50 text-sm">
                    <p className="font-mono tracking-tighter">© 2024 NEXUS DESIGN STUDIO</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                      <a href="#" className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]">Dribbble</a>
                      <a href="#" className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]">Twitter</a>
                      <a href="#" className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]">Linkedin</a>
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
              setIsAdmin(true);
              safeUpdateHistory('/admin');
              setCurrentPath('/admin');
              fetchProjects();
            }} 
            onCancel={() => setShowLogin(false)} 
          />
        )}
      </AnimatePresence>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] pointer-events-none z-1"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[150px] pointer-events-none z-1"></div>
    </div>
  );
};

export default App;