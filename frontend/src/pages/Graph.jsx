import React, { useState, useEffect } from 'react'
import { getAPIs, getAPIDependencies } from '../services/api'
import DependencyGraph from '../components/DependencyGraph'
import { Loader2, AlertCircle, Network } from 'lucide-react'

export default function Graph() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apis, setApis] = useState([])
  const [selectedApi, setSelectedApi] = useState(null)
  const [graphData, setGraphData] = useState(null)

  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await getAPIs()
        const apisData = response.data || []
        setApis(apisData)
        if (apisData.length > 0) {
          setSelectedApi(apisData[0].id)
        }
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch APIs')
      } finally {
        setLoading(false)
      }
    }

    fetchAPIs()
  }, [])

  useEffect(() => {
    if (!selectedApi) return

    const fetchGraph = async () => {
      try {
        const response = await getAPIDependencies(selectedApi)
        setGraphData(response.data)
      } catch (err) {
        console.warn(`Failed to fetch graph data: ${err.message}`)
      }
    }

    fetchGraph()
  }, [selectedApi])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <div className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Loading dependencies...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 text-red-800 dark:text-red-300">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Connection Error</p>
          <p className="text-sm mt-1 opacity-90">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Dependency Graph</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Visualize API service dependencies and blast radius</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Network className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          <label className="text-zinc-700 dark:text-zinc-300 font-semibold tracking-tight">Select Origin API</label>
        </div>
        
        <select
          value={selectedApi || ''}
          onChange={(e) => setSelectedApi(e.target.value)}
          className="w-full max-w-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-medium mb-6"
        >
          {apis.map((api) => (
            <option key={api.id} value={api.id}>
              {api.endpoint}
            </option>
          ))}
        </select>

        {graphData ? (
          <DependencyGraph data={graphData} />
        ) : (
          <div className="text-center text-zinc-500 dark:text-zinc-400 py-12 font-medium">No graph data available.</div>
        )}
      </div>
    </div>
  )
}
