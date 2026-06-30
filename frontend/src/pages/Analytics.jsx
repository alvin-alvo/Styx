import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import { Activity, ShieldAlert, Cpu, Database } from 'lucide-react';
import api from '../services/api';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        await api.post('/api/v1/analytics/train-model');
        const response = await api.get('/api/v1/analytics/overview');
        setOverview(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load analytics');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Syncing Telemetry...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-800 dark:text-red-300 text-sm font-medium">
        {error}
      </div>
    );
  }

  if (!overview) return null;

  const { zombie_trend, distribution, risk_heatmap, top_at_risk, ml_model_metrics } = overview;

  // Reusable card wrapper
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Phase 2.1: ML-Powered API Intelligence</p>
        </div>
      </div>

      {/* ML Model Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Cpu size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Model Type</div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{ml_model_metrics.model_type}</div>
          </div>
        </Card>
        
        <Card className={`flex items-center gap-4 p-5 ${ml_model_metrics.is_trained ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : ''}`}>
          <div className={`p-3 rounded-lg ${ml_model_metrics.is_trained ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
            <Activity size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Training Status</div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{ml_model_metrics.is_trained ? 'Active & Trained' : 'Not Trained'}</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">
            <Database size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Samples Analyzed</div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{ml_model_metrics.training_samples.toLocaleString()}</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Feature Vectors</div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{ml_model_metrics.features_count}</div>
          </div>
        </Card>
      </div>

      {/* Zombie Trend */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Zombie API Trend</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">30-day historical progression of API lifecycles</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-600 dark:text-red-500 tracking-tight">{zombie_trend.current_zombie_count}</div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Active Zombies ({zombie_trend.zombie_percentage.toFixed(1)}%)
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={zombie_trend.trend_data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--tw-bg-opacity, white)', borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 500 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
              <Line type="monotone" dataKey="zombie_count" stroke="#dc2626" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} name="Zombies" />
              <Line type="monotone" dataKey="active_count" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} name="Active" />
              <Line type="monotone" dataKey="deprecated_count" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} name="Deprecated" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight mb-6">Status Distribution</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(distribution.by_status).map(([status, count]) => ({ status, count }))} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {Object.entries(distribution.by_status).map(([status]) => (
                    <Cell key={status} fill={status === 'ACTIVE' ? '#10b981' : status === 'DEPRECATED' ? '#f59e0b' : status === 'ZOMBIE' ? '#dc2626' : '#71717a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top At-Risk APIs */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Critical Endpoints</h2>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">
              {top_at_risk.critical_count} High Risk
            </span>
          </div>
          <div className="space-y-3">
            {top_at_risk.top_apis.slice(0, 4).map((api, idx) => (
              <div key={api.api_id} className="group flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {api.endpoint.length > 25 ? api.endpoint.substring(0, 25) + '...' : api.endpoint}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      LC: {(api.zombie_score * 100).toFixed(0)}% • Sec: {(api.security_risk * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className={`text-sm font-bold ${api.combined_risk > 0.7 ? 'text-red-600 dark:text-red-500' : 'text-amber-600 dark:text-amber-500'}`}>
                    {(api.combined_risk * 100).toFixed(0)}%
                  </div>
                  <div className="w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${api.combined_risk > 0.7 ? 'bg-red-600 dark:bg-red-500' : 'bg-amber-500 dark:bg-amber-400'}`}
                      style={{ width: `${api.combined_risk * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
