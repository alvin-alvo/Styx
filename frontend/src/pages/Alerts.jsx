import React, { useState, useEffect } from 'react'
import { getAlerts, acknowledgeAlert } from '../services/api'
import AlertsFeed from '../components/AlertsFeed'
import { Loader2, AlertCircle } from 'lucide-react'

export default function Alerts() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Initial fetch
    const fetchAlerts = async () => {
      try {
        const response = await getAlerts()
        setAlerts(response.data || [])
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()

    // Connect to SSE stream
    const eventSource = new EventSource('http://localhost:8000/api/v1/alerts/stream')
    
    eventSource.addEventListener('new_alerts', (e) => {
      try {
        const newAlerts = JSON.parse(e.data)
        if (newAlerts && newAlerts.length > 0) {
          setAlerts((prev) => {
            // Prepend new alerts and filter out duplicates
            const existingIds = new Set(prev.map(a => a.id))
            const uniqueNew = newAlerts.filter(a => !existingIds.has(a.id))
            return [...uniqueNew, ...prev]
          })
        }
      } catch (err) {
        console.error('Error parsing SSE data', err)
      }
    })

    eventSource.onerror = (err) => {
      console.error('SSE Error', err)
      // The browser will automatically try to reconnect
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeAlert(alertId)
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)))
    } catch (err) {
      console.error('Failed to acknowledge alert:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <div className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Syncing alerts...</div>
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
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Alerts</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">API lifecycle anomalies and security events</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden p-6">
        <AlertsFeed alerts={alerts} onAcknowledge={handleAcknowledge} />
      </div>
    </div>
  )
}
