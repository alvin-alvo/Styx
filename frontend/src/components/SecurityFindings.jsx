import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function SecurityFindings({ findings = [] }) {
  const [expanded, setExpanded] = useState({})

  const severityClass = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
    }
  }

  if (!findings.length) {
    return <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg p-6 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">No security findings reported.</div>
  }

  return (
    <div className="space-y-3">
      {findings.map((finding, index) => {
        const isOpen = !!expanded[index]
        return (
          <div key={`${finding.category}-${index}`} className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-lg overflow-hidden transition-all">
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [index]: !isOpen }))}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-left"
            >
              <div className="flex-1 pr-4">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight">{finding.category}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`px-2 py-0.5 border rounded text-xs font-bold tracking-wider ${severityClass(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">CVSS: {finding.cvss_score.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-zinc-400 dark:text-zinc-500 shrink-0">
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            {isOpen && (
              <div className="p-4 pt-0 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mt-4">{finding.description}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
