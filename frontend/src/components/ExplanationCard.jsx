import { useTranslation } from 'react-i18next';
import React from 'react'

const LABELS = {
  traffic_decay: 'traffic decay',
  documentation: 'documentation gap',
  auth_weakness: 'authentication weakness',
  dependency_orphan: 'dependency orphan',
}

export default function ExplanationCard({ zombieScore, factors, classification, api }) {
  const percentScore = Math.round((zombieScore || 0) * 100)
  
  // Helpers for the checklist
  const trafficDays = api?.dormant_duration_days || 0
  
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Why was this classified as {classification || 'UNKNOWN'}?
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Deterministic reasoning based on lifecycle signals</p>
      </div>

      <div className="space-y-3 mb-8">
        {factors?.traffic_decay > 0 ? (
          <div className="flex items-center text-zinc-900 dark:text-zinc-100/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            No traffic in {trafficDays} days
          </div>
        ) : (
          <div className="flex items-center text-zinc-600 dark:text-zinc-400">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Active traffic recently
          </div>
        )}

        {!api?.owner ? (
          <div className="flex items-center text-zinc-900 dark:text-zinc-100/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            Missing owner
          </div>
        ) : (
          <div className="flex items-center text-zinc-600 dark:text-zinc-400">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Owned by {api.owner}
          </div>
        )}

        {!api?.has_documentation ? (
          <div className="flex items-center text-zinc-900 dark:text-zinc-100/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            No documentation
          </div>
        ) : (
          <div className="flex items-center text-zinc-600 dark:text-zinc-400">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Documented
          </div>
        )}

        {factors?.auth_weakness > 0 ? (
          <div className="flex items-center text-zinc-900 dark:text-zinc-100/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            Weak or missing authentication
          </div>
        ) : (
          <div className="flex items-center text-zinc-600 dark:text-zinc-400">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Strong authentication
          </div>
        )}

        {factors?.dependency_orphan > 0 ? (
          <div className="flex items-center text-zinc-900 dark:text-zinc-100/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            No dependent services
          </div>
        ) : (
          <div className="flex items-center text-zinc-600 dark:text-zinc-400">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Has dependent services
          </div>
        )}
      </div>

      <div className="bg-white/50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
        <h4 className="text-zinc-900 dark:text-zinc-100 font-bold mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          Score = {percentScore}%
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div>35% traffic decay</div>
          <div>25% documentation gap</div>
          <div>20% authentication weakness</div>
          <div>20% dependency orphan</div>
        </div>
      </div>
    </div>
  )
}
