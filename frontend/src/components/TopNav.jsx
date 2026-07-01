import { useTranslation } from 'react-i18next';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, LayoutDashboard, Package, Shield, Link as LinkIcon, Zap, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import LanguageSwitcher from './LanguageSwitcher';
import EbpfControls from './EbpfControls';
import { AnimatePresence, motion } from 'framer-motion';

const FEATURES = [
  { name: 'Global Dashboard', path: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'API Inventory', path: '/dashboard/inventory', icon: Package },
  { name: 'Security Matrix', path: '/dashboard/security', icon: Shield },
  { name: 'Dependency Graph', path: '/dashboard/graph', icon: LinkIcon },
  { name: 'Blast Radius Simulator', path: '/dashboard/simulator', icon: Zap },
  { name: 'Alerts & Events', path: '/dashboard/alerts', icon: AlertTriangle }
];

export default function TopNav({ isSidebarOpen, onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppContext();
  const { t } = useTranslation();
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Generate Breadcrumbs from location
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = pathnames.map((value, index) => {
    const translationKey = `nav.${value}`;
    const translated = t(translationKey);
    const label = translated === translationKey ? value.charAt(0).toUpperCase() + value.slice(1) : translated;
    const path = '/' + pathnames.slice(0, index + 1).join('/');
    return { label, path, isLast: index === pathnames.length - 1 };
  });

  useEffect(() => {
    const handleFocusSearch = () => {
      searchInputRef.current?.focus();
    };
    window.addEventListener('focusSearch', handleFocusSearch);
    return () => window.removeEventListener('focusSearch', handleFocusSearch);
  }, []);

  const filteredFeatures = FEATURES.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFeature = (path) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
    navigate(path);
  };

  return (
    <div className="h-16 relative sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 flex items-center justify-between flex-shrink-0">
      
      {/* Left: Breadcrumbs & Toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {crumb.isLast ? (
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  {crumb.label}
                </Link>
              )}
              {!crumb.isLast && <span className="text-zinc-400 dark:text-zinc-600">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Center: Search */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder={t("topnav.search")}
            className="block w-full pl-10 pr-12 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-zinc-600 dark:placeholder:text-zinc-400"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="inline-flex items-center px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800">
              Ctrl/⌘K
            </kbd>
          </div>

          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50 py-2"
              >
                <div className="px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Features & Pages
                </div>
                {filteredFeatures.length > 0 ? (
                  <div className="flex flex-col">
                    {filteredFeatures.map(feature => {
                      const Icon = feature.icon;
                      return (
                        <button
                          key={feature.path}
                          onClick={() => handleSelectFeature(feature.path)}
                          className="flex items-center space-x-3 w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <Icon className="w-4 h-4 text-zinc-400 group-hover:text-blue-500" />
                          <span>{feature.name}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    No pages or features found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <EbpfControls />

        <LanguageSwitcher />

        <button 
          onClick={toggleTheme} 
          className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title="Toggle Theme (Ctrl/⌘D)"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
