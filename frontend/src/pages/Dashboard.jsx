import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, BarChart3, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api, { getAlerts } from '../services/api';
import { CardSkeleton, ChartSkeleton } from '../components/Skeleton';

const COLORS = {
  ACTIVE: '#10b981', // emerald-500
  DEPRECATED: '#f59e0b', // amber-500
  ZOMBIE: '#f43f5e', // rose-500
  SHADOW: '#a855f7' // purple-500
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    overview: null,
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // First recalculate stats
        await api.post('/api/v1/analytics/recalculate-stats').catch(() => {});
        
        const [overviewRes, alertsRes] = await Promise.all([
          api.get('/api/v1/analytics/overview'),
          getAlerts()
        ]);
        
        setData({
          overview: overviewRes.data,
          alerts: alertsRes.data || []
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{t('dash.title')}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{t('dash.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><ChartSkeleton /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl p-6 text-rose-600 dark:text-rose-400">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Error loading dashboard
        </h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const { overview, alerts } = data;
  if (!overview) return null;

  // Derive metrics
  const totalAPIs = Object.values(overview.distribution.by_status).reduce((a, b) => a + b, 0);
  const activeZombies = overview.distribution.by_status.ZOMBIE || 0;
  
  // Calculate average risk score
  const avgRiskScore = overview.top_at_risk?.top_apis?.length 
    ? Math.round(overview.top_at_risk.top_apis.reduce((acc, curr) => acc + curr.combined_risk, 0) / overview.top_at_risk.top_apis.length * 100)
    : 0;

  const openAlerts = alerts.filter(a => !a.acknowledged).length;

  const kpis = [
    { label: 'Total APIs', value: totalAPIs, icon: Activity, color: 'text-blue-500' },
    { label: 'Active Zombies', value: activeZombies, icon: ShieldAlert, color: 'text-rose-500', isAlert: true },
    { label: 'Avg Risk Score', value: `${avgRiskScore}%`, icon: BarChart3, color: 'text-amber-500' },
    { label: 'Open Alerts', value: openAlerts, icon: AlertCircle, color: 'text-purple-500' }
  ];

  // Prepare Donut Chart Data
  const donutData = Object.entries(overview.distribution.by_status).map(([key, value]) => ({
    name: key,
    value
  }));

  // Prepare Area Chart Data (using zombie_trend.trend_data)
  const areaData = overview.zombie_trend?.trend_data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{t("dash.title")}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{t("dash.subtitle")}</p>
      </div>

      {/* KPI Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-5 flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  {kpi.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className={`text-3xl font-bold ${kpi.isAlert && kpi.value > 0 ? 'text-rose-500' : 'text-zinc-900 dark:text-white'}`}>
                    {kpi.value}
                  </h3>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Area Chart - 30 Day Usage/Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-6">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-6">30-Day API Lifecycle Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.ACTIVE} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.ACTIVE} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorZombie" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.ZOMBIE} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.ZOMBIE} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'currentColor' }} 
                  className="text-zinc-600 dark:text-zinc-400"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'currentColor' }} 
                  className="text-zinc-600 dark:text-zinc-400"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tw-prose-body)', borderColor: 'var(--tw-prose-body)' }} // Fallback
                  wrapperClassName="!bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800 !text-zinc-900 dark:!text-white rounded-lg shadow-xl"
                  itemStyle={{ color: 'inherit' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="active_count" 
                  name="Active APIs"
                  stroke={COLORS.ACTIVE} 
                  fillOpacity={1} 
                  fill="url(#colorActive)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="zombie_count" 
                  name="Zombie APIs"
                  stroke={COLORS.ZOMBIE} 
                  fillOpacity={1} 
                  fill="url(#colorZombie)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart - Status Distribution */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-6">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-6">Status Distribution</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip 
                  wrapperClassName="!bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800 !text-zinc-900 dark:!text-white rounded-lg shadow-xl"
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
