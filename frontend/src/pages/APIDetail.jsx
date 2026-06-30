import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAPIDetails, getAPIScore, generateAISummary } from '../services/api'
import ExplanationCard from '../components/ExplanationCard'
import SecurityFindings from '../components/SecurityFindings'
import ReactMarkdown from 'react-markdown'

export default function APIDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [api, setApi] = useState(null)
  const [score, setScore] = useState(null)
  
  const [aiSummary, setAiSummary] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [apiRes, scoreRes] = await Promise.all([getAPIDetails(id), getAPIScore(id)])
        setApi(apiRes.data)
        setScore(scoreRes.data)
      } catch (err) {
        setError(err.message || 'Failed to load API details')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleAskAI = async () => {
    setAiLoading(true)
    setAiError(null)
    try {
      const apiData = { ...api, score }
      const res = await generateAISummary(apiData, 'api_detail')
      setAiSummary(res.data)
    } catch (err) {
      setAiError(err.response?.data?.detail || err.message || 'Failed to connect to AI')
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) return <div className="text-ice-blue/70">Loading details...</div>
  if (error) return <div className="text-red-300">{error}</div>
  if (!api || !score) return <div className="text-ice-blue/70">No data found.</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-ice-blue">{api.endpoint}</h1>
          <p className="text-ice-blue/70 text-sm">{api.method} • {api.current_status}</p>
        </div>
        <button
          onClick={handleAskAI}
          disabled={aiLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded font-medium transition shadow-lg shadow-purple-500/20 flex items-center space-x-2"
        >
          <span>✨</span>
          <span>{aiLoading ? 'AI is analyzing...' : 'Ask AI Analyst'}</span>
        </button>
      </div>

      {aiError && (
        <div className="bg-red-900/30 border border-red-700 rounded p-4 text-red-200 text-sm">
          {aiError}
        </div>
      )}

      {aiSummary && (
        <div className="relative p-[1px] rounded bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 animate-gradient-xy">
          <div className="bg-dark-navy p-6 rounded h-full w-full">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl">🤖</span>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                AI Analyst Summary
              </h2>
              <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded-full ml-auto">
                {aiSummary.model_used}
              </span>
            </div>
            <div className="text-ice-blue/80 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:my-0.5">
              <ReactMarkdown>{aiSummary.summary}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <ExplanationCard
        zombieScore={score.lifecycle.zombie_score}
        factors={score.lifecycle.factors}
        classification={score.lifecycle.classification}
        api={api}
      />

      <div>
        <h2 className="text-lg font-semibold text-ice-blue mb-3">Security Findings</h2>
        <SecurityFindings findings={score.security.findings} />
      </div>
    </div>
  )
}
