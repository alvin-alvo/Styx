import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Package, Shield, Link as LinkIcon, Zap, AlertTriangle, BarChart2, LogOut, Hexagon, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar({ isOpen, onToggle }) {
  const { logout } = useAppContext();
  const { t } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <aside
      className={`${isOpen ? 'w-64' : 'w-20'} bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden flex flex-col z-20 flex-shrink-0`}
    >
      <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center shrink-0">
        <div className="flex items-center space-x-2 overflow-hidden w-full cursor-pointer" onClick={onToggle}>
          {isOpen ? (
            <img src="/logo-full.png" alt="Styx Logo" className="h-6 w-auto" />
          ) : (
            <img src="/logo-short.png" alt="Styx Logo" className="h-6 w-auto shrink-0" />
          )}
        </div>
      </div>

      <nav className="flex-1 mt-6 space-y-1 overflow-y-auto px-3 pb-4">
        <NavItem to="/dashboard/overview" label={t('nav.overview')} icon={LayoutDashboard} open={isOpen} />
        <NavItem to="/dashboard/inventory" label={t('nav.inventory')} icon={Package} open={isOpen} />
        <NavItem to="/dashboard/security" label={t('nav.security')} icon={Shield} open={isOpen} />
        <NavItem to="/dashboard/graph" label={t('nav.graph')} icon={LinkIcon} open={isOpen} />
        <NavItem to="/dashboard/simulator" label={t('nav.simulator')} icon={Zap} open={isOpen} />
        <NavItem to="/dashboard/alerts" label={t('nav.alerts')} icon={AlertTriangle} open={isOpen} />
        <NavItem to="/dashboard/analytics" label={t('nav.analytics')} icon={BarChart2} open={isOpen} />
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0 space-y-2">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center space-x-3 px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors rounded-lg overflow-hidden"
          title={t('nav.logout')}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="font-medium whitespace-nowrap">{t('nav.logout')}</span>}
        </button>

        {isOpen && (
          <div className="px-3 pt-2">
             <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">{t('nav.shortcuts')}</p>
             <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
               <span>{t('nav.search')}</span>
               <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">Ctrl/⌘K</span>
             </div>
             <div className="flex items-center justify-between text-xs text-zinc-600">
               <span>{t('nav.theme')}</span>
               <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">Ctrl/⌘D</span>
             </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl w-full max-w-sm p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-500 mb-4">
              <LogOut className="w-6 h-6" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Confirm Logout</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Are you sure you want to end your current session? You will need to sign in again to access the platform.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function NavItem({ to, label, icon: Icon, open }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  
  return (
    <RouterNavLink
      to={to}
      title={!open ? label : undefined}
      className={`flex items-center space-x-3 px-3 py-2 transition-colors rounded-lg overflow-hidden ${
        isActive 
          ? 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500' 
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {open && <span className="font-medium whitespace-nowrap">{label}</span>}
    </RouterNavLink>
  );
}
