import { useTranslation } from 'react-i18next';
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatScore } from '../utils/formatters'
import FilterBar from './FilterBar'
import clsx from 'clsx'
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react'

export default function InventoryTable({ apis }) {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('zombie_score')
  const [sortOrder, setSortOrder] = useState('desc') // Default High to Low risk
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const sorted = useMemo(() => {
    let data = [...apis]
    if (filterStatus) {
      data = data.filter((api) => api.current_status === filterStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter((api) => 
        (api.endpoint || '').toLowerCase().includes(q) || 
        (api.owner || '').toLowerCase().includes(q)
      )
    }

    return data.sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case 'endpoint':
          aVal = a.endpoint || ''
          bVal = b.endpoint || ''
          break
        case 'status':
          aVal = a.current_status || ''
          bVal = b.current_status || ''
          break
        case 'zombie_score':
          aVal = a.zombie_score || 0
          bVal = b.zombie_score || 0
          break
        case 'last_traffic_seen':
          aVal = new Date(a.last_traffic_seen || 0).getTime()
          bVal = new Date(b.last_traffic_seen || 0).getTime()
          break
        case 'owner':
          aVal = a.owner || ''
          bVal = b.owner || ''
          break
        default:
          aVal = a.endpoint || ''
          bVal = b.endpoint || ''
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [apis, sortBy, sortOrder, filterStatus, searchQuery])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc') // Default new sorts to desc for scores
    }
  }

  const handleSortToggle = () => {
    setSortBy('zombie_score')
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const statuses = [...new Set(apis.map((a) => a.current_status))].filter(Boolean)

  const StatusBadge = ({ status }) => {
    const badgeClass = clsx(
      'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      {
        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20': status === 'ACTIVE',
        'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20': status === 'DEPRECATED',
        'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20': status === 'ZOMBIE',
        'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20': status === 'SHADOW',
        'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700': !['ACTIVE', 'DEPRECATED', 'ZOMBIE', 'SHADOW'].includes(status)
      }
    )

    return <span className={badgeClass}>{status}</span>
  }

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null
    return (
      <span className="inline-block ml-1 text-zinc-400">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 flex flex-col">
      <FilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        statuses={statuses}
        sortByRisk={sortBy === 'zombie_score' ? sortOrder : 'desc'}
        onSortToggle={handleSortToggle}
        totalCount={apis.length}
        filteredCount={sorted.length}
        placeholder={t("inv.search")}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th
                className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                onClick={() => handleSort('endpoint')}
              >
                Endpoint <SortIcon column="endpoint" />
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">{t("inv.col2")}</th>
              <th
                className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                onClick={() => handleSort('owner')}
              >
                Owner <SortIcon column="owner" />
              </th>
              <th
                className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon column="status" />
              </th>
              <th
                className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                onClick={() => handleSort('zombie_score')}
              >
                Risk Score <SortIcon column="zombie_score" />
              </th>
              <th
                className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                onClick={() => handleSort('last_traffic_seen')}
              >
                Last Seen <SortIcon column="last_traffic_seen" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {sorted.length > 0 ? (
              sorted.map((api) => (
                <tr
                  key={api.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/dashboard/inventory/${api.id}`)}
                >
                  <td className="px-6 py-4 font-mono text-xs text-zinc-900 dark:text-zinc-100">
                    <span className="text-zinc-600 dark:text-zinc-400 mr-2 font-sans font-medium">{api.method}</span>
                    {api.endpoint}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5">
                       {api.has_documentation ? (
                         <ShieldCheck className="w-4 h-4 text-emerald-500" title="Documented & Verified" />
                       ) : (
                         <ShieldAlert className="w-4 h-4 text-rose-500 opacity-80" title="Missing Documentation" />
                       )}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                    {api.owner ? (
                      <span className="font-medium">{api.owner}</span>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={api.current_status} />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span className={clsx(
                      api.zombie_score >= 0.7 ? 'text-rose-600 dark:text-rose-400' : 
                      api.zombie_score >= 0.4 ? 'text-amber-600 dark:text-amber-400' : 
                      'text-emerald-600 dark:text-emerald-400'
                    )}>
                      {formatScore(api.zombie_score)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    {formatDate(api.last_traffic_seen)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-zinc-600 dark:text-zinc-400">
                  No APIs found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
