import React, { useState, useEffect } from 'react'
import { getEbpfState, updateEbpfState } from '../services/api'

export default function EbpfControls() {
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
    <div className="flex items-center space-x-4 bg-navy border border-light-navy/80 rounded-xl px-4 py-2 shadow-lg">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-ice-blue uppercase tracking-widest text-emerald-400">eBPF Collector</span>
        <span className="text-[10px] text-ice-blue/60">{state.source}</span>
      </div>

      <div className="h-8 w-px bg-light-navy/50 mx-2"></div>

      <div className="flex items-center space-x-3">
        {state.status === 'playing' ? (
          <button onClick={() => handleAction('status', 'paused')} className="p-1.5 rounded-full bg-ice-blue/10 hover:bg-ice-blue/20 text-ice-blue" title="Pause">
            ⏸
          </button>
        ) : (
          <button onClick={() => handleAction('status', 'playing')} className="p-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400" title="Play">
            ▶
          </button>
        )}
        <button onClick={() => handleAction('status', 'restart')} className="p-1.5 rounded-full bg-ice-blue/10 hover:bg-ice-blue/20 text-ice-blue" title="Restart">
          ⏮
        </button>
      </div>

      <div className="h-8 w-px bg-light-navy/50 mx-2"></div>

      <div className="flex items-center space-x-2 text-xs font-medium text-ice-blue/80">
        <button 
          onClick={() => handleAction('speed', 0.5)} 
          className={`px-2 py-1 rounded ${state.speed === 0.5 ? 'bg-purple-600 text-white' : 'bg-light-navy hover:bg-light-navy/80'}`}
        >
          0.5x
        </button>
        <button 
          onClick={() => handleAction('speed', 1.0)} 
          className={`px-2 py-1 rounded ${state.speed === 1.0 ? 'bg-purple-600 text-white' : 'bg-light-navy hover:bg-light-navy/80'}`}
        >
          1x
        </button>
        <button 
          onClick={() => handleAction('speed', 2.0)} 
          className={`px-2 py-1 rounded ${state.speed === 2.0 ? 'bg-purple-600 text-white' : 'bg-light-navy hover:bg-light-navy/80'}`}
        >
          2x
        </button>
        <button 
          onClick={() => handleAction('speed', 5.0)} 
          className={`px-2 py-1 rounded ${state.speed === 5.0 ? 'bg-purple-600 text-white' : 'bg-light-navy hover:bg-light-navy/80'}`}
        >
          5x
        </button>
      </div>

      <div className="h-8 w-px bg-light-navy/50 mx-2"></div>

      <div className="flex flex-col items-end">
        <span className="text-[10px] text-ice-blue/60 uppercase">Events</span>
        <span className="text-sm font-bold text-ice-blue">
          {state.events_processed.toLocaleString()} <span className="text-ice-blue/40 font-normal">/ {state.total_events.toLocaleString()}</span>
        </span>
      </div>
      
      {state.status === 'playing' && (
        <span className="relative flex h-3 w-3 ml-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      )}
    </div>
  )
}
