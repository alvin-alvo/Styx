import { useTranslation } from 'react-i18next';
import React, { useState, useMemo } from 'react'
import DependencyGraph from './DependencyGraph'
import { generateAISummary } from '../services/api'
import ReactMarkdown from 'react-markdown'
import { Sparkles, Bot } from 'lucide-react'

export default function BlastRadiusSimulator({ apis, onSimulate }) {
  const [selectedApis, setSelectedApis] = useState([])
  const [simulating, setSimulating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [aiSummary, setAiSummary] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  // Sort APIs by incoming_dependencies (descending)
  const sortedApis = useMemo(() => {
    return [...apis].sort((a, b) => (b.incoming_dependencies || 0) - (a.incoming_dependencies || 0))
  }, [apis])

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
    setAiSummary(null) // Reset AI summary on new simulation

    try {
      const response = await onSimulate(selectedApis)
      setResult(response.data)
    } catch (err) {
      setError(err.message || 'Simulation failed')
    } finally {
      setSimulating(false)
    }
  }

  const handleAskAI = async () => {
    if (!result) return
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await generateAISummary(result, 'blast_radius')
      setAiSummary(res.data)
    } catch (err) {
      setAiError(err.response?.data?.detail || err.message || 'Failed to connect to AI')
    } finally {
      setAiLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'text-red-400 bg-red-900/20 border-red-700'
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      default:
        return 'text-green-400 bg-green-900/20 border-green-700'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Left Panel - API Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Select APIs to Decommission</h3>
        <div className="max-h-96 overflow-y-auto space-y-2 bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 rounded p-4">
          {sortedApis.map((api) => (
            <label
              key={api.id}
              className="flex items-center space-x-3 p-3 hover:bg-white dark:bg-zinc-900 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedApis.includes(api.id)}
                onChange={() => handleToggleApi(api.id)}
                className="rounded border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-ice-blue"
              />
              <div className="flex-1">
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{api.endpoint}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs">{api.method} • {api.current_status}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded">
                  {api.incoming_dependencies || 0} callers
                </span>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleSimulate}
          disabled={simulating || selectedApis.length === 0}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-white font-semibold transition"
        >
          {simulating ? 'Simulating...' : `Simulate Decommission (${selectedApis.length})`}
        </button>
      </div>

      {/* Right Panel - Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Impact Analysis</h3>
          {result && (
            <button
              onClick={handleAskAI}
              disabled={aiLoading}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white text-sm rounded font-medium transition shadow-lg shadow-purple-500/20 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{aiLoading ? 'AI is analyzing...' : 'Ask AI Analyst'}</span>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded p-4 text-red-200">
            {error}
          </div>
        )}

        {!result && !error && (
          <div className="bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 rounded p-8 text-center text-zinc-600 dark:text-zinc-400">
            Select APIs and run simulation
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Visual Dependency Graph */}
            {result.graph && (
              <div className="bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden h-64">
                <DependencyGraph data={result.graph} simulatedDecommission={selectedApis} />
              </div>
            )}

            {aiError && (
              <div className="bg-red-900/30 border border-red-700 rounded p-4 text-red-200 text-sm">
                {aiError}
              </div>
            )}

            {/* AI Analyst Summary Box */}
            {aiSummary && (
              <div className="relative p-[1px] rounded bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 animate-gradient-xy">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded h-full w-full">
                  <div className="flex items-center space-x-2 mb-4">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      AI Executive Summary
                    </h2>
                    <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded-full ml-auto">
                      {aiSummary.model_used}
                    </span>
                  </div>
                  <div className="text-zinc-700 dark:text-zinc-300 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:my-0.5">
                    <ReactMarkdown>{aiSummary.summary}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className={`border rounded p-4 ${getSeverityColor(result.severity)} col-span-2`}>
                <p className="text-sm opacity-70 mb-1">Impact Severity</p>
                <p className="text-2xl font-bold">{result.severity}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 rounded p-4">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Dependent Services</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{result.dependent_services}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 rounded p-4">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Traffic Impact</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {(result.traffic_percentage * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Impact Score */}
            <div className="bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 rounded p-4">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">Overall Impact Score</p>
              <div className="w-full bg-white dark:bg-zinc-900 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 transition-all duration-500 ${
                    result.impact_score > 0.7
                      ? 'bg-red-500'
                      : result.impact_score > 0.3
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${result.impact_score * 100}%` }}
                ></div>
              </div>
              <p className="text-zinc-900 dark:text-zinc-100 mt-2 font-semibold">{(result.impact_score * 100).toFixed(0)}%</p>
            </div>

            {/* Recommendation */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4">
              <p className="text-zinc-900 dark:text-white font-semibold mb-2">Recommendation</p>
              <p className="text-zinc-700 dark:text-zinc-300">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
