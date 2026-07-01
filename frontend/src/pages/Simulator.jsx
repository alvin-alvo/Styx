import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react'
import { getAPIs, simulateBlastRadius } from '../services/api'
import BlastRadiusSimulator from '../components/BlastRadiusSimulator'
import { PageSkeleton } from '../components/Skeleton'
import InfoTooltip from '../components/InfoTooltip'

export default function Simulator() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apis, setApis] = useState([])

  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await getAPIs()
        setApis(response.data || [])
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch APIs')
      } finally {
        setLoading(false)
      }
    }

    fetchAPIs()
  }, [])

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
          {t("sim.title")}
          <InfoTooltip text={t("sim.info")} />
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t("sim.subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <BlastRadiusSimulator apis={apis} onSimulate={simulateBlastRadius} />
      </div>
    </div>
  )
}
