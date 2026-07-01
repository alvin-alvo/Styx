import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getEbpfState, updateEbpfState } from '../services/api'

export default function EbpfControls() {
  const { t } = useTranslation()
  const [state, setState] = useState(null)

  useEffect(() => {
    // Poll the state every second
    const interval = setInterval(async () => {
      try {
        const res = await getEbpfState()
        setState(res.data)
      } catch (e) {
        console.error("Failed to fetch eBPF state", e)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!state) return null

  const handleAction = async (action, val = null) => {
    try {
      if (action === 'status') {
        await updateEbpfState(val, null)
      } else if (action === 'speed') {
        await updateEbpfState(null, val)
      }
      const res = await getEbpfState()
      setState(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex items-center space-x-4 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 shadow-sm">
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
          <Activity className="w-3 h-3 text-blue-500" />
          {t("ebpf.title")}
        </span>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{state.source}</span>
      </div>

      <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 mx-2"></div>

      <div className="flex items-center space-x-3">
        {state.status === 'playing' ? (
          <button onClick={() => handleAction('status', 'paused')} className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 transition-colors" title="Pause">
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => handleAction('status', 'playing')} className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors" title="Play">
            <Play className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => handleAction('status', 'restart')} className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 transition-colors" title="Restart">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 mx-2"></div>

      <div className="flex items-center space-x-2 text-xs font-medium">
        <button 
          onClick={() => handleAction('speed', 0.5)} 
          className={`px-2 py-1 rounded transition-colors ${state.speed === 0.5 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm' : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'}`}
        >
          0.5x
        </button>
        <button 
          onClick={() => handleAction('speed', 1.0)} 
          className={`px-2 py-1 rounded transition-colors ${state.speed === 1.0 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm' : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'}`}
        >
          1x
        </button>
        <button 
          onClick={() => handleAction('speed', 2.0)} 
          className={`px-2 py-1 rounded transition-colors ${state.speed === 2.0 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm' : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'}`}
        >
          2x
        </button>
        <button 
          onClick={() => handleAction('speed', 5.0)} 
          className={`px-2 py-1 rounded transition-colors ${state.speed === 5.0 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm' : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'}`}
        >
          5x
        </button>
      </div>

      <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 mx-2"></div>

      <div className="flex flex-col items-end">
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{t("ebpf.events")}</span>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          {state.events_processed.toLocaleString()} <span className="text-zinc-400 dark:text-zinc-500 font-normal">/ {state.total_events.toLocaleString()}</span>
        </span>
      </div>
      
      {state.status === 'playing' && (
        <span className="relative flex h-2 w-2 ml-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      )}
    </div>
  )
}
