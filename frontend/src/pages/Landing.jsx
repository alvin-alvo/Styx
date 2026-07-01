import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bot, BoxSelect, ShieldAlert, Activity, 
  Map, Fingerprint, Users, Database 
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-300 relative">
      
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-20 dark:opacity-10 z-0">
        <div className="w-[800px] h-[800px] border-[1px] border-zinc-900 dark:border-white rounded-full absolute -top-1/4 animate-[spin_60s_linear_infinite]" />
        <div className="w-[600px] h-[600px] border-[1px] border-zinc-900 dark:border-white rounded-full absolute -left-1/4 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="w-[1000px] h-[1000px] border-[1px] border-zinc-900 dark:border-white rounded-full absolute -right-1/4 animate-[spin_80s_linear_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
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
              Secure the Core.<br/>
              Decommission with Confidence.
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The API lifecycle intelligence platform that empowers financial institutions to safely eliminate risky legacy endpoints without breaking critical dependent systems.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-lg hover:scale-105 transition-transform shadow-lg shadow-red-500/20"
              style={{ backgroundColor: '#DA251C' }}
            >
              Try Now
            </Link>
          </motion.div>
        </section>

        {/* ALTERNATING FEATURE BLOCKS */}
        <section className="max-w-7xl mx-auto px-6 py-24 space-y-32">
          
          {/* Block 1: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="aspect-[4/3] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <Bot className="w-32 h-32 text-zinc-300 dark:text-zinc-700" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white mb-4 shadow-sm" style={{ backgroundColor: '#00579C' }}>
                Styx AI Assistant
              </span>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Command your API lifecycle through agentic intelligence.</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Styx AI operates as your real-time security architect: instantly detect zombie connections, simulate decommissioning blast radii, and generate strict remediation steps through professional dialogue. Stop guessing about system dependencies. Ask the question; secure the perimeter.
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-md hover:scale-105 transition-transform shadow-md"
                style={{ backgroundColor: '#DA251C' }}
              >
                Try Now
              </Link>
            </motion.div>
          </div>

          {/* Block 2: Text Left, Image Right */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white mb-4 shadow-sm" style={{ backgroundColor: '#00579C' }}>
                Inventory
              </span>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Total API inventory. Zero operational blind spots.</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                The Styx Inventory is your single source of truth. Instantly classify thousands of endpoints into Active, Deprecated, Shadow, or Zombie status. Stop guessing what is running on your network and start managing your actual attack surface with real-time, deterministic scoring.
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-md hover:scale-105 transition-transform shadow-md"
                style={{ backgroundColor: '#DA251C' }}
              >
                Try Now
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="aspect-[4/3] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <BoxSelect className="w-32 h-32 text-zinc-300 dark:text-zinc-700" />
              </div>
            </motion.div>
          </div>

          {/* Block 3: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="aspect-[4/3] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <Map className="w-32 h-32 text-zinc-300 dark:text-zinc-700" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white mb-4 shadow-sm" style={{ backgroundColor: '#00579C' }}>
                Blast Radius Simulate
              </span>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Predict cascading failures before they happen.</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                The Styx Simulator is your architectural sandbox. Run predictive blast radius simulations using live graph topology to see exactly how decommissioning an endpoint impacts downstream applications, internal microservices, or external merchant gateways. Eliminate operational guesswork and validate system resilience in a zero-risk environment.
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-md hover:scale-105 transition-transform shadow-md"
                style={{ backgroundColor: '#DA251C' }}
              >
                Try Now
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="bg-zinc-100 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Core Intelligence Engine</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Everything you need to secure and govern your enterprise API landscape.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Activity, title: "Live Telemetry Ingestion", desc: "Native eBPF interception for zero-instrumentation real-time traffic analysis." },
                { icon: ShieldAlert, title: "Deterministic ML Scoring", desc: "Modified Z-Score and MAD anomaly detection for accurate zombie identification." },
                { icon: Map, title: "D3.js Dependency Mapping", desc: "Interactive force-directed graphs to visualize service-to-service communication paths." },
                { icon: Fingerprint, title: "Real-Time Shadow API Alerts", desc: "Instant detection of undocumented endpoints deployed outside of standard governance." },
                { icon: Database, title: "OWASP-Mapped Security", desc: "Automated vulnerability assessment matched against latest OWASP API security top 10." },
                { icon: Users, title: "Multi-Tenant Architecture", desc: "Row-level data isolation built for large-scale enterprise deployments." }
              ].map((feat, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-zinc-800 flex items-center justify-center mb-4 text-[#00579C] dark:text-blue-400">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 relative z-10">
              Start your free trial now
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto relative z-10">
              Join leading financial institutions in securing the perimeter and modernizing legacy infrastructure.
            </p>
            <Link 
              to="/login"
              className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-lg hover:scale-105 transition-transform shadow-lg shadow-red-500/20"
              style={{ backgroundColor: '#DA251C' }}
            >
              Start Free Trial
            </Link>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
