import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
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
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Check if the profiles table exists and has entries
        const { count, error: profileError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // If the table doesn't exist (error code 42P01) or is empty, we need installation
        const isFreshInstall = (profileError && profileError.code === '42P01') || count === 0;
        setNeedsInstall(isFreshInstall);

        // 2. Check Session
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        // 3. Routing Logic
        if (currentPath === '/install' && !isFreshInstall) {
          window.history.replaceState({}, '', '/');
          setCurrentPath('/');
        } else if (currentPath === '/admin' && !!session) {
          setIsAdmin(true);
        } else if (currentPath === '/admin' && !session) {
          setShowLogin(true);
        }

        setIsInitialCheckDone(true);
        fetchProjects();
      } catch (err: any) {
        console.error('Initialization crash:', err.message);
        setIsInitialCheckDone(true);
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setIsAdmin(false);
      } else {
        setNeedsInstall(false);
      }
    });

    const handlePopState = () => setCurrentPath(window.location.pathname);
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

      if (error) {
        // Only log if it's not a missing table error (which is handled by needsInstall)
        if (error.code !== '42P01') {
          console.error('Error fetching projects:', error.message);
        }
      } else {
        const mappedProjects: Project[] = (data || []).map((p: any) => ({
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
      console.error('Fetch exception:', e.message);
    }
  };

  const toggleAdmin = () => {
    if (isAuthenticated) {
      setIsAdmin(!isAdmin);
      window.history.pushState({}, '', isAdmin ? '/' : '/admin');
    } else {
      setShowLogin(true);
    }
  };

  if (!isInitialCheckDone) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505] text-white font-mono">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="tracking-widest"
        >
          BOOTING_NEXUS_CORE...
        </motion.div>
      </div>
    );
  }

  // Setup/Installation View
  if (needsInstall || (currentPath === '/install' && needsInstall)) {
    return (
      <Register 
        isInstallMode={true}
        onComplete={() => { 
          setNeedsInstall(false); 
          setIsAdmin(true); 
          window.history.replaceState({}, '', '/admin');
          setCurrentPath('/admin');
          fetchProjects();
        }} 
      />
    );
  }

  // Admin View
  if (isAdmin && isAuthenticated) {
    return (
      <AdminDashboard 
        onClose={() => {
          setIsAdmin(false);
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }} 
        projects={projects} 
        onUpdate={fetchProjects}
      />
    );
  }

  // Main Landing View
  return (
    <div className="relative w-full min-h-screen bg-[#050505] selection:bg-purple-500/30">
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-white font-mono">STABILIZING_FLUID_SCENE...</div>}>
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 5], fov: 45 }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <color attach="background" args={['#050505']} />
          <ScrollControls pages={7} damping={0.2}>
            <Scene3D />
            <Scroll html>
              <main className="w-full">
                <Hero />
                <Services />
                <Portfolio projects={projects} />
                <ExperienceTimeline />
                <TechStack />
                <Testimonials />
                <Contact />
                
                <footer className="w-full py-20 px-10 flex flex-col md:flex-row justify-between items-center opacity-50 text-sm">
                  <p>© 2024 NEXUS DESIGN STUDIO</p>
                  <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]">Dribbble</a>
                    <a href="#" className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]">Twitter</a>
                    <a href="#" className="hover:text-purple-400 transition-colors uppercase tracking-widest text-[10px]">Linkedin</a>
                  </div>
                </footer>
                <div className="h-24" />
              </main>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </Suspense>

      <Navbar onAdminClick={toggleAdmin} />

      <AnimatePresence>
        {showLogin && (
          <Login 
            onLogin={() => {
              setShowLogin(false);
              setIsAdmin(true);
              window.history.pushState({}, '', '/admin');
              setCurrentPath('/admin');
              fetchProjects();
            }} 
            onCancel={() => setShowLogin(false)} 
          />
        )}
      </AnimatePresence>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[150px] pointer-events-none"></div>
    </div>
  );
};

export default App;