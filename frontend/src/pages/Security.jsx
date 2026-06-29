import React, { useState, useEffect } from 'react'
import { getAPIs, getAPIScore } from '../services/api'
import SecurityMatrix from '../components/SecurityMatrix'
import { Loader2, AlertCircle } from 'lucide-react'

export default function Security() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apis, setApis] = useState([])
  const [scores, setScores] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apisResponse = await getAPIs()
        const apisData = apisResponse.data || []
        setApis(apisData)

        const scoreResults = await Promise.allSettled(
          apisData.map((api) => getAPIScore(api.id).then((response) => ({ id: api.id, data: response.data })))
        )
        const scoresMap = {}
        scoreResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            scoresMap[result.value.id] = result.value.data
          }
        })
        setScores(scoresMap)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <div className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Analyzing security posture...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 text-red-800 dark:text-red-300">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Analysis Error</p>
          <p className="text-sm mt-1 opacity-90">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Security Posture</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Holistic view of API security risk vs lifecycle status</p>
      </div>

      <SecurityMatrix apis={apis} scores={scores} />
    </div>
  )
}
