import React, { useState, useEffect } from 'react'
import { getAPIs } from '../services/api'
import InventoryTable from '../components/InventoryTable'
import { Loader2, AlertCircle } from 'lucide-react'

export default function Inventory() {
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
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <div className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Syncing Inventory...</div>
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
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">API Inventory</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">View and manage all APIs in your infrastructure</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
        <InventoryTable apis={apis} />
      </div>
    </div>
  )
}
