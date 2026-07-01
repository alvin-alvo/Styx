import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Code, Code2, Layout, Database, Search } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const teamMembers = [
  {
    name: "Hrisheekesh PV",
    role: "Behavioural detection and log analysis",
    icon: Search
  },
  {
    name: "Alvin Binoy",
    role: "Full Stack Development, Secure Network Architecture and AI Assisted Workflows",
    icon: Code2
  },
  {
    name: "Karthik",
    role: "Backend developer",
    icon: Database
  },
  {
    name: "Bhavitha Jayaprakash",
    role: "Frontend, Testing, ML, Research and documentation",
    icon: Layout
  }
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-300">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span 
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-4 shadow-sm"
            style={{ backgroundColor: '#00579C' }}
          >
            Team Z Row
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Meet the Builders
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            We are Z Row, a dedicated team of engineers and researchers building the future of API Lifecycle Intelligence and operational security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, idx) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group flex items-start space-x-6"
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: '#00579C' }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{member.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    {member.role}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <Code className="w-5 h-5" />
                    </button>
                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <Globe className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
