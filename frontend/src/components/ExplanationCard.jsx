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
    <div className="bg-navy/30 border border-light-navy/40 rounded-lg p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-ice-blue mb-1">
          Why was this classified as {classification || 'UNKNOWN'}?
        </h3>
        <p className="text-ice-blue/60 text-sm">Deterministic reasoning based on lifecycle signals</p>
      </div>

      <div className="space-y-3 mb-8">
        {factors?.traffic_decay > 0 ? (
          <div className="flex items-center text-ice-blue/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            No traffic in {trafficDays} days
          </div>
        ) : (
          <div className="flex items-center text-ice-blue/50">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Active traffic recently
          </div>
        )}

        {!api?.owner ? (
          <div className="flex items-center text-ice-blue/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            Missing owner
          </div>
        ) : (
          <div className="flex items-center text-ice-blue/50">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Owned by {api.owner}
          </div>
        )}

        {!api?.has_documentation ? (
          <div className="flex items-center text-ice-blue/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            No documentation
          </div>
        ) : (
          <div className="flex items-center text-ice-blue/50">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Documented
          </div>
        )}

        {factors?.auth_weakness > 0 ? (
          <div className="flex items-center text-ice-blue/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            Weak or missing authentication
          </div>
        ) : (
          <div className="flex items-center text-ice-blue/50">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Strong authentication
          </div>
        )}

        {factors?.dependency_orphan > 0 ? (
          <div className="flex items-center text-ice-blue/90">
            <span className="text-red-400 mr-3 text-lg font-bold">✗</span> 
            No dependent services
          </div>
        ) : (
          <div className="flex items-center text-ice-blue/50">
            <span className="text-emerald-400 mr-3 text-lg font-bold">✓</span> 
            Has dependent services
          </div>
        )}
      </div>

      <div className="bg-dark-navy/50 p-4 rounded-md border border-light-navy/20">
        <h4 className="text-ice-blue font-bold mb-3 border-b border-light-navy/30 pb-2">
          Score = {percentScore}%
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-ice-blue/70">
          <div>35% traffic decay</div>
          <div>25% documentation gap</div>
          <div>20% authentication weakness</div>
          <div>20% dependency orphan</div>
        </div>
      </div>
    </div>
  )
}
