import { useTranslation } from 'react-i18next';
import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Package, Shield, Link as LinkIcon, Zap, AlertTriangle, BarChart2, LogOut, Hexagon, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar({ isOpen, onToggle }) {
  const { logout } = useAppContext();
  const { t } = useTranslation();

  return (
    <aside
      className={`${isOpen ? 'w-64' : 'w-20'} bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden flex flex-col z-20 flex-shrink-0`}
    >
      <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center shrink-0">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-500 overflow-hidden w-full cursor-pointer" onClick={onToggle}>
          <Hexagon className="w-6 h-6 shrink-0 fill-current" />
          {isOpen && <span className="text-xl font-bold tracking-tight">STYX</span>}
        </div>
      </div>

      <nav className="flex-1 mt-6 space-y-1 overflow-y-auto px-3 pb-4">
        <NavItem to="/dashboard/overview" label={t('nav.overview')} icon={LayoutDashboard} open={isOpen} />
        <NavItem to="/dashboard/inventory" label={t('nav.inventory')} icon={Package} open={isOpen} />
        <NavItem to="/dashboard/security" label={t('nav.security')} icon={Shield} open={isOpen} />
        <NavItem to="/dashboard/graph" label={t('nav.dependencies')} icon={LinkIcon} open={isOpen} />
        <NavItem to="/dashboard/simulator" label={t('nav.simulator')} icon={Zap} open={isOpen} />
        <NavItem to="/dashboard/alerts" label={t('nav.alerts')} icon={AlertTriangle} open={isOpen} />
        <NavItem to="/dashboard/analytics" label={t('nav.analytics')} icon={BarChart2} open={isOpen} />
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0 space-y-2">
        <button 
          onClick={logout}
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
               <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">⌘K</span>
             </div>
             <div className="flex items-center justify-between text-xs text-zinc-600">
               <span>{t('nav.theme')}</span>
               <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">⌘D</span>
             </div>
          </div>
        )}
      </div>
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
