import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Verify2FA() {
  const navigate = useNavigate();
  const { verifyTOTP, bypass2FA, requires2FA } = useAppContext();
  
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user somehow got here without logging in or needing 2FA
    if (!requires2FA) {
      navigate('/login');
    }
  }, [requires2FA, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const isValid = verifyTOTP(token);
      if (isValid) {
        navigate('/dashboard');
      } else {
        setError('Invalid verification code. Please try again.');
        setIsLoading(false);
        setToken('');
      }
    }, 600);
  };

  const handleBreakGlass = () => {
    bypass2FA();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md z-10 relative"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm relative">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center" style={{ color: '#00579C' }}>
                  <ShieldAlert className="w-8 h-8" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Two-Factor Authentication</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                Enter the 6-digit code from your authenticator app to continue.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className={`w-full bg-zinc-50 dark:bg-zinc-800/50 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600'} text-zinc-900 dark:text-white px-4 py-4 rounded-lg text-center text-3xl font-mono tracking-[0.5em] focus:outline-none transition-colors`}
                    required
                    autoFocus
                  />
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-3 font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || token.length !== 6}
                  className="w-full flex items-center justify-center space-x-2 text-white px-4 py-4 rounded-lg font-medium transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-md"
                  style={{ backgroundColor: '#DA251C' }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Verify</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Break-Glass Override */}
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleBreakGlass}
                  className="text-xs text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
                  title="Use in case of demo emergency"
                >
                  Break-Glass Override
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
