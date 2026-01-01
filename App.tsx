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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Nexus: Booting systems...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gateway Timeout: DB Connection failed.')), 10000)
      );

      try {
        const checkProfiles = async () => {
          try {
            const { count, error } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true });
            return { count, error };
          } catch (e) {
            return { count: 0, error: e };
          }
        };

        const result = await Promise.race([checkProfiles(), timeoutPromise]);
        const { count, error: profileError } = result as any;

        const tableNotFound = profileError && (
          profileError.code === '42P01' || 
          profileError.message?.toLowerCase().includes('not found') ||
          profileError.message?.toLowerCase().includes('does not exist')
        );
        
        const isFreshInstall = tableNotFound || (count === 0 && !profileError);
        setNeedsInstall(!!isFreshInstall);

        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (currentPath === '/install' && !isFreshInstall) {
          window.history.replaceState({}, '', '/');
          setCurrentPath('/');
        } else if (currentPath === '/admin') {
          if (session) setIsAdmin(true);
          else setShowLogin(true);
        }

        setIsInitialCheckDone(true);
        fetchProjects();
      } catch (err: any) {
        console.error('Nexus Initialization Crash:', err.message);
        setErrorMsg(err.message);
        setIsInitialCheckDone(true);
        setNeedsInstall(true); 
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) setIsAdmin(false);
      else setNeedsInstall(false);
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
        if (error.code !== '42P01' && !error.message?.includes('not found')) {
          console.error('Nexus Fetch Error:', error.message);
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
      console.error('Nexus Fetch Exception:', e.message);
    }
  };

  const toggleAdmin = () => {
    if (isAuthenticated) {
      setIsAdmin(!isAdmin);
      window.history.pushState({}, '', isAdmin ? '/' : '/admin');
      setCurrentPath(isAdmin ? '/' : '/admin');
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
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] tracking-widest uppercase opacity-50">Synchronizing_Neural_Grid...</span>
        </motion.div>
      </div>
    );
  }

  if (needsInstall || currentPath === '/install') {
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

  return (
    <div className="relative w-full min-h-screen bg-[#050505] selection:bg-purple-500/30">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen text-white font-mono uppercase tracking-widest text-[10px] opacity-30">
          Loading_Assets...
        </div>
      }>
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

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] pointer-events-none z-1"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[150px] pointer-events-none z-1"></div>
    </div>
  );
};

export default App;