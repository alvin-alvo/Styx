import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatScore } from '../utils/formatters'

export default function InventoryTable({ apis }) {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('endpoint')
  const [sortOrder, setSortOrder] = useState('asc')
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
      setSortOrder('asc')
    }
  }

  const statuses = [...new Set(apis.map((a) => a.current_status))].filter(Boolean)

  const StatusBadge = ({ status }) => {
    const colorClass = {
      ACTIVE: 'bg-emerald-900/50 text-emerald-200 border-emerald-500/30',
      DEPRECATED: 'bg-amber-900/50 text-amber-200 border-amber-500/30',
      ZOMBIE: 'bg-rose-900/50 text-rose-200 border-rose-500/30',
      SHADOW: 'bg-purple-900/50 text-purple-200 border-purple-500/30',
    }[status]

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass || 'bg-gray-900 text-gray-200'}`}
      >
        {status}
      </span>
    )
  }

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <span className="text-ice-blue/30 ml-2">⇅</span>
    return <span className="text-ice-blue ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="space-y-4 bg-navy/30 rounded-lg shadow-lg border border-light-navy/30 overflow-hidden">
      {/* Filter & Search Bar */}
      <div className="px-6 py-4 border-b border-light-navy/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search endpoint or owner..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark-navy border border-light-navy/50 text-ice-blue px-3 py-2 rounded text-sm w-full sm:w-64 focus:outline-none focus:border-ice-blue/50"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-dark-navy border border-light-navy/50 text-ice-blue px-3 py-2 rounded text-sm focus:outline-none focus:border-ice-blue/50"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="text-ice-blue/50 text-sm font-medium">
          Showing {sorted.length} of {apis.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-navy border-b border-light-navy/30">
            <tr>
              <th
                className="px-6 py-4 text-left text-ice-blue font-semibold cursor-pointer hover:bg-light-navy/20 transition"
                onClick={() => handleSort('endpoint')}
              >
                Endpoint <SortIcon column="endpoint" />
              </th>
              <th className="px-6 py-4 text-left text-ice-blue font-semibold">Security/Docs</th>
              <th
                className="px-6 py-4 text-left text-ice-blue font-semibold cursor-pointer hover:bg-light-navy/20 transition"
                onClick={() => handleSort('owner')}
              >
                Owner <SortIcon column="owner" />
              </th>
              <th
                className="px-6 py-4 text-left text-ice-blue font-semibold cursor-pointer hover:bg-light-navy/20 transition"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon column="status" />
              </th>
              <th
                className="px-6 py-4 text-left text-ice-blue font-semibold cursor-pointer hover:bg-light-navy/20 transition"
                onClick={() => handleSort('zombie_score')}
              >
                Risk Score <SortIcon column="zombie_score" />
              </th>
              <th
                className="px-6 py-4 text-left text-ice-blue font-semibold cursor-pointer hover:bg-light-navy/20 transition"
                onClick={() => handleSort('last_traffic_seen')}
              >
                Last Seen <SortIcon column="last_traffic_seen" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-navy/20">
            {sorted.length > 0 ? (
              sorted.map((api) => (
                <tr
                  key={api.id}
                  className="hover:bg-light-navy/20 transition cursor-pointer group"
                  onClick={() => navigate(`/inventory/${api.id}`)}
                >
                  <td className="px-6 py-4 text-ice-blue font-mono text-xs group-hover:text-white transition">
                    <span className="text-ice-blue/50 mr-2 font-sans font-bold">{api.method}</span>
                    {api.endpoint}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    {api.has_documentation ? (
                      <span title="Documented" className="text-emerald-400 text-lg">📄</span>
                    ) : (
                      <span title="Missing Documentation" className="text-rose-400 opacity-50 text-lg">📄</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-ice-blue/80 text-xs">
                    {api.owner ? (
                      <span className="px-2 py-1 bg-light-navy/30 rounded border border-light-navy/50">{api.owner}</span>
                    ) : (
                      <span className="text-ice-blue/40 italic">Unowned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={api.current_status} />
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    <span className={api.zombie_score >= 0.7 ? 'text-rose-400' : api.zombie_score >= 0.4 ? 'text-amber-400' : 'text-emerald-400'}>
                      {formatScore(api.zombie_score)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ice-blue/70 text-xs">
                    {formatDate(api.last_traffic_seen)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-ice-blue/50">
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
