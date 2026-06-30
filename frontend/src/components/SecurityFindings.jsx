import { useTranslation } from 'react-i18next';
import React, { useState } from 'react'

export default function SecurityFindings({ findings = [] }) {
  const [expanded, setExpanded] = useState({})

  const severityClass = (severity) => {
    if (severity === 'CRITICAL') return 'bg-red-900/30 text-red-200 border-red-700'
    if (severity === 'HIGH') return 'bg-orange-900/30 text-orange-200 border-orange-700'
    if (severity === 'MEDIUM') return 'bg-yellow-900/30 text-yellow-200 border-yellow-700'
    return 'bg-green-900/30 text-green-200 border-green-700'
  }

  if (!findings.length) {
    return <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-zinc-600 dark:text-zinc-400">No findings.</div>
  }

  return (
    <div className="space-y-3">
      {findings.map((finding, index) => {
        const isOpen = !!expanded[index]
        return (
          <div key={`${finding.category}-${index}`} className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-white font-semibold">{finding.category}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">CVSS: {finding.cvss_score}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 border rounded text-xs ${severityClass(finding.severity)}`}>{finding.severity}</span>
                <button
                  onClick={() => setExpanded((prev) => ({ ...prev, [index]: !isOpen }))}
                  className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:text-zinc-100"
                >
                  {isOpen ? 'Hide' : 'Details'}
                </button>
              </div>
            </div>
            {isOpen && <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3">{finding.description}</p>}
          </div>
        )
      })}
    </div>
  )
}
