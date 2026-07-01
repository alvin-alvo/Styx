import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bot, BoxSelect, ShieldAlert, Activity, 
  Map, Fingerprint, Users, Database 
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

export default function Landing() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-300 relative">
      
      {/* Abstract Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-zinc-50 dark:bg-zinc-950">
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] opacity-20 dark:opacity-10"
          style={{ backgroundColor: '#00579C' }}
        />
        <motion.div
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 100, -50, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-0 w-[800px] h-[800px] rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[150px] opacity-20 dark:opacity-10"
          style={{ backgroundColor: '#DA251C' }}
        />
        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-1/4 w-[700px] h-[700px] rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] opacity-15 dark:opacity-5"
          style={{ backgroundColor: '#00579C' }}
        />
      </div>

      <PublicNavbar />

      <main className="flex-1 relative z-10">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-32 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
              {t('landing.hero.t1')}<br/>
              {t('landing.hero.t2')}
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('landing.hero.sub')}
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-lg hover:scale-105 transition-transform shadow-lg shadow-red-500/20"
              style={{ backgroundColor: '#DA251C' }}
            >
              {t('landing.try_now')}
            </Link>
          </motion.div>
        </section>

        {/* ALTERNATING FEATURE BLOCKS */}
        <section className="max-w-7xl mx-auto px-6 py-24 space-y-32">
          
          {/* Block 1: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full h-[450px]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{t('landing.alt1.pill')}</h4>
                      <p className="text-xs text-zinc-500">{t('chat.sub')}</p>
                    </div>
                  </div>
                  <div className="text-zinc-400 cursor-not-allowed">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                </div>
                {/* Chat Area */}
                <div className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col justify-end bg-zinc-50/50 dark:bg-zinc-900/50 relative">
                  
                  {/* AI Message */}
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm text-zinc-800 dark:text-zinc-200 shadow-sm">
                      {t('landing.mock.chat.ai1')}
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm shadow-sm">
                      {t('landing.mock.chat.user1')}
                    </div>
                  </div>

                  {/* AI Message (Long) */}
                  <div className="flex justify-start relative z-10">
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[95%] text-sm text-zinc-800 dark:text-zinc-200 shadow-sm leading-relaxed whitespace-pre-line">
                      {t('landing.mock.chat.ai2')}
                    </div>
                  </div>

                  {/* Fade out at bottom for partial visibility */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-50/50 dark:from-zinc-900/50 to-transparent z-20 pointer-events-none"></div>
                </div>
                {/* Input Bar */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 relative z-30">
                  <div className="relative">
                    <input type="text" disabled placeholder={t('chat.placeholder')} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-full pl-4 pr-12 py-2.5 text-sm text-zinc-400 focus:outline-none cursor-not-allowed" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 cursor-not-allowed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="w-full md:w-1/2"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white mb-4 shadow-sm" style={{ backgroundColor: '#00579C' }}>
                {t('landing.alt1.pill')}
              </span>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{t('landing.alt1.title')}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                {t('landing.alt1.desc')}
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-md hover:scale-105 transition-transform shadow-md"
                style={{ backgroundColor: '#DA251C' }}
              >
                {t('landing.try_now')}
              </Link>
            </motion.div>
          </div>

          {/* Block 2: Text Left, Image Right */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white mb-4 shadow-sm" style={{ backgroundColor: '#00579C' }}>
                {t('landing.alt2.pill')}
              </span>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{t('landing.alt2.title')}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                {t('landing.alt2.desc')}
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-md hover:scale-105 transition-transform shadow-md"
                style={{ backgroundColor: '#DA251C' }}
              >
                {t('landing.try_now')}
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="w-full md:w-1/2"
            >
              <div className="aspect-[4/3] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                <img src="/inventory.png" alt="Styx Inventory" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Block 3: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <div className="aspect-[4/3] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                <img src="/blast_radius.png" alt="Styx Blast Radius Simulator" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="w-full md:w-1/2"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white mb-4 shadow-sm" style={{ backgroundColor: '#00579C' }}>
                {t('landing.alt3.pill')}
              </span>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{t('landing.alt3.title')}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                {t('landing.alt3.desc')}
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-md hover:scale-105 transition-transform shadow-md"
                style={{ backgroundColor: '#DA251C' }}
              >
                {t('landing.try_now')}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="bg-zinc-100 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{t('landing.grid.title')}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{t('landing.grid.sub')}</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Activity, title: t('landing.grid.f1.title'), desc: t('landing.grid.f1.desc') },
                { icon: ShieldAlert, title: t('landing.grid.f2.title'), desc: t('landing.grid.f2.desc') },
                { icon: Map, title: t('landing.grid.f3.title'), desc: t('landing.grid.f3.desc') },
                { icon: Fingerprint, title: t('landing.grid.f4.title'), desc: t('landing.grid.f4.desc') },
                { icon: Database, title: t('landing.grid.f5.title'), desc: t('landing.grid.f5.desc') },
                { icon: Users, title: t('landing.grid.f6.title'), desc: t('landing.grid.f6.desc') }
              ].map((feat, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-zinc-800 flex items-center justify-center mb-4 text-[#00579C] dark:text-blue-400">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-12 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 relative z-10">
              {t('landing.cta.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto relative z-10">
              {t('landing.cta.sub')}
            </p>
            <Link 
              to="/login"
              className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-lg hover:scale-105 transition-transform shadow-lg shadow-red-500/20"
              style={{ backgroundColor: '#DA251C' }}
            >
              {t('landing.start_trial')}
            </Link>
          </motion.div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
