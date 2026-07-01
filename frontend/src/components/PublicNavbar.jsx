import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function PublicNavbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useAppContext();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <img src="/logo-full.png" alt="Styx Logo" className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            {t('nav.home')}
          </Link>
          <button 
            onClick={() => alert(t('nav.product_soon'))}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t('nav.product')}
          </button>
          <button 
            onClick={() => alert(t('nav.pricing_soon'))}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {t('nav.pricing')}
          </button>
          <Link to="/contact" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            {t('nav.contact')}
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link 
            to="/login" 
            className="text-sm font-medium text-white px-4 py-2 rounded-md transition-colors shadow-sm"
            style={{ backgroundColor: '#DA251C' }}
          >
            {t('login.button') || 'Login / Sign Up'}
          </Link>
        </div>
      </header>
      <div className="h-[65px] w-full shrink-0" aria-hidden="true"></div>
    </>
  );
}
