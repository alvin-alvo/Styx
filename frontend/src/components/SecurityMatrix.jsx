import React, { useMemo } from 'react'
import { ShieldCheck, ShieldAlert, Activity, AlertTriangle } from 'lucide-react'

export default function SecurityMatrix({ apis, scores }) {
  const matrixData = useMemo(() => {
    return apis.map((api) => {
      const score = scores[api.id]
      return {
        id: api.id,
        endpoint: api.endpoint,
        lifecycle: score?.lifecycle?.zombie_score || 0,
        security: score?.security?.security_risk_score || 0,
        status: api.current_status,
      }
    })
  }, [apis, scores])

  const getQuadrantColor = (lifecycle, security) => {
    if (security > 0.6 && lifecycle > 0.6) return '#ef4444' // Red-500
    if (security > 0.6) return '#f97316' // Orange-500
    if (lifecycle > 0.6) return '#eab308' // Yellow-500
    return '#10b981' // Emerald-500
  }

  const getQuadrantLabel = (lifecycle, security) => {
    if (security > 0.6 && lifecycle > 0.6) return 'Critical Risk'
    if (security > 0.6) return 'Security Risk'
    if (lifecycle > 0.6) return 'Lifecycle Risk'
    return 'Healthy'
  }

  const stats = {
    critical: matrixData.filter((d) => d.lifecycle > 0.6 && d.security > 0.6).length,
    healthy: matrixData.filter((d) => d.lifecycle <= 0.4 && d.security <= 0.4).length,
    total: matrixData.length
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Critical APIs</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.critical}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Healthy APIs</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.healthy}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total APIs</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mb-6 text-sm font-medium">
          {[
            { label: 'Critical Risk', color: '#ef4444' },
            { label: 'Security Risk', color: '#f97316' },
            { label: 'Lifecycle Risk', color: '#eab308' },
            { label: 'Healthy', color: '#10b981' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
              <span className="text-zinc-600 dark:text-zinc-400">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 2D Scatter Plot */}
        <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <svg width="100%" height="400" viewBox="0 0 600 400" className="w-full h-auto">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="600" height="400" fill="url(#grid)" />

            {/* Axis lines */}
            <line x1="50" y1="350" x2="550" y2="350" className="stroke-zinc-400 dark:stroke-zinc-600" strokeWidth="2" />
            <line x1="50" y1="350" x2="50" y2="50" className="stroke-zinc-400 dark:stroke-zinc-600" strokeWidth="2" />

            {/* Quadrant backgrounds (using Tailwind colors with opacity) */}
            <rect x="50" y="50" width="250" height="300" fill="#10b981" opacity="0.05" className="dark:opacity-[0.03]" />
            <rect x="300" y="50" width="250" height="300" fill="#eab308" opacity="0.05" className="dark:opacity-[0.03]" />
            <rect x="50" y="200" width="250" height="150" fill="#f97316" opacity="0.05" className="dark:opacity-[0.03]" />
            <rect x="300" y="200" width="250" height="150" fill="#ef4444" opacity="0.05" className="dark:opacity-[0.03]" />

            {/* Threshold lines */}
            <line x1="50" y1="170" x2="550" y2="170" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
            <line x1="350" y1="50" x2="350" y2="350" stroke="#eab308" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

            {/* Axis labels */}
            <text x="300" y="385" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12" fontWeight="500">
              Lifecycle Risk Score →
            </text>
            <text x="20" y="200" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12" fontWeight="500" transform="rotate(-90 20 200)">
              Security Risk Score →
            </text>

            {/* Data points */}
            {matrixData.map((point) => {
              const x = 50 + point.lifecycle * 500
              const y = 350 - point.security * 300
              const color = getQuadrantColor(point.lifecycle, point.security)
              return (
                <circle
                  key={point.id}
                  cx={x}
                  cy={y}
                  r="6"
                  fill={color}
                  stroke="#fff"
                  strokeWidth="1.5"
                  className="transition-all hover:r-8 cursor-pointer drop-shadow-sm dark:stroke-zinc-900"
                  title={`${point.endpoint}\nLifecycle: ${(point.lifecycle*100).toFixed(0)}% | Security: ${(point.security*100).toFixed(0)}%`}
                />
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
