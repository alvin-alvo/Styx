import React, { useState } from 'react'
import { Play, AlertCircle, Activity, Network } from 'lucide-react'

export default function BlastRadiusSimulator({ apis, onSimulate }) {
  const [selectedApis, setSelectedApis] = useState([])
  const [simulating, setSimulating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleToggleApi = (apiId) => {
    setSelectedApis((prev) =>
      prev.includes(apiId) ? prev.filter((id) => id !== apiId) : [...prev, apiId]
    )
  }

  const handleSimulate = async () => {
    if (selectedApis.length === 0) {
      setError('Please select at least one API')
      return
    }

    setSimulating(true)
    setError(null)

    try {
      const response = await onSimulate(selectedApis)
      setResult(response.data)
    } catch (err) {
      setError(err.message || 'Simulation failed')
    } finally {
      setSimulating(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800'
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
      {/* Left Panel - API Selection */}
      <div className="p-6 space-y-5 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Select Origin Points</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Choose APIs to simulate decommissioning</p>
        </div>
        
        <div className="max-h-96 overflow-y-auto space-y-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-inner">
          {apis.map((api) => (
            <label
              key={api.id}
              className={`flex items-start space-x-3 p-3 rounded-md cursor-pointer transition-colors border ${
                selectedApis.includes(api.id) 
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                  : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedApis.includes(api.id)}
                onChange={() => handleToggleApi(api.id)}
                className="mt-0.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
              />
              <div className="flex-1">
                <p className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">{api.endpoint}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    {api.method}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">{api.current_status}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleSimulate}
          disabled={simulating || selectedApis.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-sm"
        >
          {simulating ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Simulate Decommission ({selectedApis.length})
            </>
          )}
        </button>
      </div>

      {/* Right Panel - Results */}
      <div className="p-6 space-y-5 bg-white dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Impact Analysis</h3>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 text-red-800 dark:text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!result && !error && (
          <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-500">
            <Activity className="w-8 h-8 mb-3 opacity-50" />
            <p className="font-medium text-sm">Select APIs and run simulation to view impact</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Severity Badge */}
            <div className={`border rounded-xl p-5 ${getSeverityColor(result.severity)}`}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Impact Severity</p>
              <p className="text-3xl font-bold tracking-tight">{result.severity}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-2">
                  <Network className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Dependent Services</p>
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.dependent_services}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-2">
                  <Activity className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Traffic Impact</p>
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {(result.traffic_percentage * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Impact Score */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Overall Impact Score</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      result.impact_score > 0.7
                        ? 'bg-red-500'
                        : result.impact_score > 0.3
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${result.impact_score * 100}%` }}
                  ></div>
                </div>
                <p className="text-zinc-900 dark:text-zinc-50 font-bold tracking-tight">{(result.impact_score * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-5">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Recommendation</p>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 leading-relaxed">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
