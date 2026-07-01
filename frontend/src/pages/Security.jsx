import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useMemo } from 'react'
import { getAPIs, getAPIScore } from '../services/api'
import SecurityMatrix from '../components/SecurityMatrix'
import FilterBar from '../components/FilterBar'
import { PageSkeleton } from '../components/Skeleton'
import InfoTooltip from '../components/InfoTooltip'

export default function Security() {
  const { t } = useTranslation();
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

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filteredApis = useMemo(() => {
    let data = [...apis]
    if (filterStatus) {
      data = data.filter((api) => api.current_status === filterStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter((api) => 
        (api.endpoint || '').toLowerCase().includes(q)
      )
    }
    return data
  }, [apis, searchQuery, filterStatus])

  const statuses = [...new Set(apis.map((a) => a.current_status))].filter(Boolean)

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
          {t("sec.title")}
          <InfoTooltip text={t("sec.info")} />
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t("sec.subtitle")}</p>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col overflow-hidden">
        <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800">
          <FilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            statuses={statuses}
            totalCount={apis.length}
            filteredCount={filteredApis.length}
            placeholder={t("sec.search")}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <SecurityMatrix apis={filteredApis} scores={scores} />
        </div>
      </div>
    </div>
  )
}
