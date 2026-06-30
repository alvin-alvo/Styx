import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAPIDetails, getAPIScore } from '../services/api'
import ExplanationCard from '../components/ExplanationCard'
import SecurityFindings from '../components/SecurityFindings'
import { Loader2, ShieldAlert } from 'lucide-react'

export default function APIDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [api, setApi] = useState(null)
  const [score, setScore] = useState(null)

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <div className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Loading details...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-800 dark:text-red-300 text-sm font-medium">
        {error}
      </div>
    )
  }
  
  if (!api || !score) {
    return (
      <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">No data found.</div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight font-mono break-all">{api.endpoint}</h1>
        <div className="flex items-center gap-3 mt-3">
          <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded border border-zinc-200 dark:border-zinc-700">
            {api.method}
          </span>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-3">
            {api.current_status}
          </span>
        </div>
      </div>

      <ExplanationCard
        zombieScore={score.lifecycle.zombie_score}
        factors={score.lifecycle.factors}
        classification={score.lifecycle.classification}
      />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Security Findings</h2>
        </div>
        <SecurityFindings findings={score.security.findings} />
      </div>
    </div>
  )
}
