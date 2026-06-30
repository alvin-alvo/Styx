import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toggleTheme } = useAppContext();
  const location = useLocation();

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // initialize
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Hotkeys
  useHotkeys(['meta+d', 'ctrl+d'], (e) => {
    e.preventDefault();
    toggleTheme();
  }, { enableOnFormTags: true });

  useHotkeys(['meta+k', 'ctrl+k'], (e) => {
    e.preventDefault();
    // Dispatch a custom event to focus the search bar in TopNav
    window.dispatchEvent(new CustomEvent('focusSearch'));
  }, { enableOnFormTags: true });

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav isSidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
