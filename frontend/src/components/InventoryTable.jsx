import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, ArrowDown, ArrowUpDown, Search, ChevronRight } from 'lucide-react'
import { formatDate, formatScore } from '../utils/formatters'

export default function InventoryTable({ apis }) {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('endpoint')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterStatus, setFilterStatus] = useState('')

  const sorted = useMemo(() => {
    let data = [...apis]
    if (filterStatus) {
      data = data.filter((api) => api.current_status === filterStatus)
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
        default:
          aVal = a.endpoint || ''
          bVal = b.endpoint || ''
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [apis, sortBy, sortOrder, filterStatus])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const statuses = [...new Set(apis.map((a) => a.current_status))].filter(Boolean)

  const StatusBadge = ({ status }) => {
    const getStyle = (s) => {
      switch (s) {
        case 'ACTIVE':
          return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
        case 'DEPRECATED':
          return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
        case 'ZOMBIE':
        case 'SHADOW':
          return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
        default:
          return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
      }
    }

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getStyle(status)}`}>
        {status}
      </span>
    )
  }

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-1.5" /> 
      : <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-1.5" />
  }

  const thClass = "px-6 py-3.5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
  const thSortClass = `${thClass} cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group select-none`

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-medium"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-zinc-400 rotate-90" />
            </div>
          </div>
        </div>
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Showing {sorted.length} of {apis.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className={thSortClass} onClick={() => handleSort('endpoint')}>
                <div className="flex items-center">Endpoint <SortIcon column="endpoint" /></div>
              </th>
              <th className={thClass}>Method</th>
              <th className={thSortClass} onClick={() => handleSort('status')}>
                <div className="flex items-center">Status <SortIcon column="status" /></div>
              </th>
              <th className={thSortClass} onClick={() => handleSort('zombie_score')}>
                <div className="flex items-center">Zombie Score <SortIcon column="zombie_score" /></div>
              </th>
              <th className={thSortClass} onClick={() => handleSort('last_traffic_seen')}>
                <div className="flex items-center">Last Seen <SortIcon column="last_traffic_seen" /></div>
              </th>
              <th className={thClass}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {sorted.length > 0 ? (
              sorted.map((api) => (
                <tr
                  key={api.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/inventory/${api.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">{api.endpoint}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{api.method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={api.current_status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400 font-medium">
                    {formatScore(api.zombie_score)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(api.last_traffic_seen)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(`/inventory/${api.id}`)
                      }}
                    >
                      Details <ChevronRight className="w-4 h-4 ml-0.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-col items-center">
                    <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mb-3" />
                    <p className="font-medium">No APIs found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
