import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useMemo } from 'react'
import { getAlerts, acknowledgeAlert } from '../services/api'
import AlertsFeed from '../components/AlertsFeed'
import FilterBar from '../components/FilterBar'
import { PageSkeleton } from '../components/Skeleton'
import InfoTooltip from '../components/InfoTooltip'

export default function Alerts() {
  const { t } = useTranslation();
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

  const [searchQuery, setSearchQuery] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')

  const filteredAlerts = useMemo(() => {
    let data = [...alerts]
    if (filterSeverity) {
      data = data.filter((a) => a.severity === filterSeverity)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter((a) => 
        (a.alert_type || '').toLowerCase().includes(q) || 
        (a.api_id || '').toLowerCase().includes(q)
      )
    }
    return data
  }, [alerts, searchQuery, filterSeverity])

  const severities = [...new Set(alerts.map((a) => a.severity))].filter(Boolean)

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
          {t("alerts.title")}
          <InfoTooltip text="Live feed of system security events, vulnerabilities, and operational alerts requiring team attention." />
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t("alerts.subtitle")}</p>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col overflow-hidden">
        <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800">
          <FilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterSeverity}
            onFilterChange={setFilterSeverity}
            statuses={severities}
            totalCount={alerts.length}
            filteredCount={filteredAlerts.length}
            placeholder={t("alerts.search")}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <AlertsFeed alerts={filteredAlerts} onAcknowledge={handleAcknowledge} />
        </div>
      </div>
    </div>
  )
}
