import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react'
import { getAPIs, getAPIDependencies } from '../services/api'
import DependencyGraph from '../components/DependencyGraph'
import { PageSkeleton } from '../components/Skeleton'
import InfoTooltip from '../components/InfoTooltip'

export default function Graph() {
  const { t } = useTranslation();
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
    return <PageSkeleton />
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center">
          {t("graph.title")}
          <InfoTooltip text={t("graph.info")} />
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t("graph.subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <label className="text-zinc-600 dark:text-zinc-400 text-sm font-medium block mb-3">Select API:</label>
        <select
          value={selectedApi || ''}
          onChange={(e) => setSelectedApi(e.target.value)}
          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded text-sm focus:outline-none focus:border-blue-500 mb-6"
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
          <div className="text-center text-zinc-600 dark:text-zinc-400 py-8">Loading graph...</div>
        )}
      </div>
    </div>
  )
}
