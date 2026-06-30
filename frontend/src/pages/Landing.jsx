import { useTranslation } from 'react-i18next';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Shield, Sun, Moon, Zap, Network } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Landing() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useAppContext();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Abstract Data Visual Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-20 dark:opacity-10 z-0">
        <div className="w-[800px] h-[800px] border-[1px] border-zinc-900 dark:border-white rounded-full absolute -top-1/4 animate-[spin_60s_linear_infinite]" />
        <div className="w-[600px] h-[600px] border-[1px] border-zinc-900 dark:border-white rounded-full absolute -left-1/4 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="w-[1000px] h-[1000px] border-[1px] border-zinc-900 dark:border-white rounded-full absolute -right-1/4 animate-[spin_80s_linear_infinite]" />
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 relative z-20 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">STYX</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/login" className="text-sm font-medium hover:text-blue-600 transition-colors ml-2">
            {t('login.button')}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 my-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Styx Enterprise 2.0 is live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            {t('landing.hero.title')}
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>

          <div className="pt-8">
            <Link 
              to="/login"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              <span>{t('landing.cta')}</span>
              <Activity className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left w-full px-4"
        >
          <div className="p-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
               <Network className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">{t("landing.feat1.title")}</h3>
             <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
               Gain instant visibility into your entire API inventory. Detect active, deprecated, shadow, and zombie endpoints across your organization in real-time.
             </p>
          </div>
          <div className="p-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50">
               <Shield className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">{t("landing.feat2.title")}</h3>
             <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
               Deterministic threat models score your infrastructure based on lifecycle vulnerabilities, missing documentation, and active security gaps automatically.
             </p>
          </div>
          <div className="p-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
               <Zap className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">{t("landing.feat3.title")}</h3>
             <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
               Safely simulate API decommissioning. Visually map downstream impact, dependent services, and traffic disruptions before taking services offline.
             </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
