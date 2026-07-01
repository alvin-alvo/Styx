import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react'
import { getAPIs } from '../services/api'
import InventoryTable from '../components/InventoryTable'
import { PageSkeleton } from '../components/Skeleton'
import InfoTooltip from '../components/InfoTooltip'

export default function Inventory() {
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
        setApis([])
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
    <div className="flex flex-col space-y-6 h-[calc(100vh-8rem)]">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center">
          {t("inv.title")}
          <InfoTooltip text="A comprehensive registry of all discovered API endpoints across your enterprise environments." />
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">View and manage all APIs in your infrastructure</p>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
        <InventoryTable apis={apis} />
      </div>
    </div>
  )
}
