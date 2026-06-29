import React from 'react'
import { Activity } from 'lucide-react'

const WEIGHTS = {
  traffic_decay: 35,
  documentation: 25,
  auth_weakness: 20,
  dependency_orphan: 20,
}

const LABELS = {
  traffic_decay: 'Traffic Decay',
  documentation: 'Documentation Gap',
  auth_weakness: 'Auth Weakness',
  dependency_orphan: 'Dependency Orphan',
}

export default function ExplanationCard({ zombieScore, factors, classification }) {
  const items = Object.entries(factors || {})
  const ordered = items.sort((a, b) => b[1] - a[1])

  const getClassStyle = (cls) => {
    switch(cls) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      case 'DEPRECATED': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      case 'ZOMBIE': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Lifecycle Score Breakdown</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Key risk factors contributing to overall score</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
            {Math.round((zombieScore || 0) * 100)}%
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getClassStyle(classification)}`}>
            {classification || 'UNKNOWN'}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {ordered.map(([key, value]) => {
          const contribution = (value || 0) * (WEIGHTS[key] || 0)
          const percentage = Math.max(3, (value || 0) * 100)
          
          let colorClass = "bg-blue-500"
          if (percentage > 70) colorClass = "bg-red-500"
          else if (percentage > 40) colorClass = "bg-amber-500"
          
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-700 dark:text-zinc-300">{LABELS[key] || key}</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-mono">{contribution.toFixed(1)} pts</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
