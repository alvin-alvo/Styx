import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Box, Shield, Network, Zap, Bell, LineChart, PanelLeftClose, PanelLeft,
  ChevronRight, Sun, Moon
} from 'lucide-react'

import Inventory from './pages/Inventory'
import APIDetail from './pages/APIDetail'
import Security from './pages/Security'
import Graph from './pages/Graph'
import Simulator from './pages/Simulator'
import Alerts from './pages/Alerts'
import Analytics from './pages/Analytics'
import './index.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  })

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 flex flex-col shrink-0`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white font-bold">S</span>
              </div>
              {sidebarOpen && <span className="font-semibold text-lg tracking-tight whitespace-nowrap">Styx</span>}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
            <NavLink to="/inventory" label="Inventory" icon={<Box size={18} />} open={sidebarOpen} />
            <NavLink to="/security" label="Security" icon={<Shield size={18} />} open={sidebarOpen} />
            <NavLink to="/graph" label="Dependencies" icon={<Network size={18} />} open={sidebarOpen} />
            <NavLink to="/simulator" label="Simulator" icon={<Zap size={18} />} open={sidebarOpen} />
            <NavLink to="/alerts" label="Alerts" icon={<Bell size={18} />} open={sidebarOpen} />
            <NavLink to="/analytics" label="Analytics" icon={<LineChart size={18} />} open={sidebarOpen} />
          </nav>


        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
            <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
               <Breadcrumbs />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Live Telemetry</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-8 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:id" element={<APIDetail />} />
                <Route path="/security" element={<Security />} />
                <Route path="/graph" element={<Graph />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/" element={<Inventory />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  )
}

function NavLink({ to, label, icon, open }) {
  const location = useLocation()
  const isActive = location.pathname.startsWith(to)
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium'
      }`}
      title={!open ? label : undefined}
    >
      <div className="shrink-0">{icon}</div>
      {open && <span className="text-sm truncate">{label}</span>}
    </Link>
  )
}

function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  
  if (paths.length === 0) return <span className="text-zinc-900 dark:text-zinc-100 font-medium">Inventory</span>;

  return (
    <div className="flex items-center gap-1.5">
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const name = path.charAt(0).toUpperCase() + path.slice(1);
        const to = `/${paths.slice(0, index + 1).join('/')}`;
        
        return (
          <React.Fragment key={path}>
            {isLast ? (
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                {name}
              </span>
            ) : (
              <Link to={to} className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer">
                {name}
              </Link>
            )}
            {!isLast && <ChevronRight size={14} className="mx-0.5 opacity-50" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
