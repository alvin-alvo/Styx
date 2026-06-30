import { useTranslation } from 'react-i18next';
import React from 'react'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  filterStatus, 
  onFilterChange, 
  statuses = [],
  sortByRisk,
  onSortToggle,
  totalCount,
  filteredCount,
  placeholder = "Search..."
}) {
  return (
    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input 
            type="text" 
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-zinc-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9 pr-8 py-2 w-full appearance-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow to match theme */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Sort Toggle (Risk Score) */}
        {onSortToggle && (
          <button
            onClick={onSortToggle}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Risk: {sortByRisk === 'desc' ? 'High to Low' : 'Low to High'}</span>
          </button>
        )}
      </div>

      {/* Item Count */}
      {(filteredCount !== undefined && totalCount !== undefined) && (
        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium shrink-0">
          Showing {filteredCount} of {totalCount}
        </div>
      )}
    </div>
  )
}
