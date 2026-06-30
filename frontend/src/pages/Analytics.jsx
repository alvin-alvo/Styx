import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import api from '../services/api';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // First calculate population statistics
        await api.post('/api/v1/analytics/recalculate-stats');
        // Then get overview
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
      <div className="flex items-center justify-center h-96">
        <div className="text-zinc-600 dark:text-zinc-400 animate-pulse text-lg">Aggregating enterprise telemetry...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-900/50 border border-rose-500/30 rounded-lg p-6 text-rose-200">
        <h3 className="font-bold mb-2">Failed to load analytics</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  const {
    zombie_trend,
    distribution,
    risk_heatmap,
    top_at_risk,
    scoring_engine_metrics
  } = overview;

  // Compute total APIs from distribution
  const totalAPIs = Object.values(distribution.by_status).reduce((a, b) => a + b, 0);
  const zombieCount = distribution.by_status.ZOMBIE || 0;
  const shadowCount = distribution.by_status.SHADOW || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Executive Analytics Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Organization-wide API risk posture and deterministic threat scoring</p>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Total Managed APIs</div>
          <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{totalAPIs}</div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-rose-500/30 p-6 shadow-lg">
          <div className="text-sm font-medium text-rose-300/80 mb-2">Zombie APIs</div>
          <div className="text-4xl font-bold text-rose-400">{zombieCount}</div>
          <div className="text-xs text-rose-300/60 mt-2">Abandoned / undocumented</div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-purple-500/30 p-6 shadow-lg">
          <div className="text-sm font-medium text-purple-300/80 mb-2">Shadow APIs</div>
          <div className="text-4xl font-bold text-purple-400">{shadowCount}</div>
          <div className="text-xs text-purple-300/60 mt-2">Undocumented but active</div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Critical Risk Assets</div>
          <div className="text-4xl font-bold text-amber-400">{top_at_risk.critical_count}</div>
          <div className="text-xs text-amber-300/60 mt-2">&gt;70% combined risk score</div>
        </div>
      </div>

      {/* Zombie Trend */}
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Lifecycle Threat Trend (30 Days)</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Historical tracking of API abandonment vs active endpoints</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{zombie_trend.current_zombie_count} Zombies</div>
             <div className="text-sm text-zinc-600 dark:text-zinc-400">Trend: <span className={zombie_trend.trend_direction === 'increasing' ? 'text-rose-400' : 'text-emerald-400'}>{zombie_trend.trend_direction.toUpperCase()}</span></div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={zombie_trend.trend_data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#8898aa', fontSize: 12 }} stroke="#2a3f5f" />
              <YAxis tick={{ fill: '#8898aa' }} stroke="#2a3f5f" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="zombie_count" stroke="#f43f5e" strokeWidth={3} name="Zombies" dot={false} />
              <Line type="monotone" dataKey="active_count" stroke="#10b981" strokeWidth={2} name="Active" dot={false} />
              <Line type="monotone" dataKey="deprecated_count" stroke="#f59e0b" strokeWidth={2} name="Deprecated" dot={false} />
              <Line type="monotone" dataKey="shadow_count" stroke="#a855f7" strokeWidth={2} name="Shadow" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top At-Risk APIs */}
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Top {top_at_risk.top_apis.length} Highest Risk APIs</h2>
          <div className="space-y-4">
            {top_at_risk.top_apis.map((api, idx) => (
              <div key={api.api_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-200 dark:border-zinc-800 transition">
                <div className="flex-1 mb-3 sm:mb-0">
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="font-mono text-sm text-white font-semibold truncate" title={api.endpoint}>
                      {api.endpoint}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 pl-10">
                    Lifecycle Risk: {(api.zombie_score * 100).toFixed(0)}% | Security Findings: {(api.security_risk * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="sm:text-right pl-10 sm:pl-0">
                  <div className={`text-2xl font-bold ${api.combined_risk > 0.7 ? 'text-rose-400' : api.combined_risk > 0.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {(api.combined_risk * 100).toFixed(0)}%
                  </div>
                  <div className="w-full sm:w-32 bg-white dark:bg-zinc-900 rounded-full h-1.5 mt-2 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${api.combined_risk > 0.7 ? 'bg-rose-400' : api.combined_risk > 0.5 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.max(5, api.combined_risk * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Inventory by Classification</h2>
          <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(distribution.by_status).map(([status, count]) => ({
                  status, count
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" vertical={false} />
                <XAxis dataKey="status" tick={{ fill: '#8898aa', fontSize: 12 }} stroke="#2a3f5f" />
                <YAxis tick={{ fill: '#8898aa' }} stroke="#2a3f5f" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {Object.entries(distribution.by_status).map(([status]) => (
                    <Cell
                      key={status}
                      fill={status === 'ACTIVE' ? '#10b981' : status === 'DEPRECATED' ? '#f59e0b' : status === 'ZOMBIE' ? '#f43f5e' : '#a855f7'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
