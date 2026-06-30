import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ShieldCheck, Network, UserSquare2 } from 'lucide-react'

export default function AlertDetail({ alert }) {
  if (!alert) return null

  const triggerList = alert.trigger_metadata?.triggers || []
  const sourceIps = alert.trigger_metadata?.source_ips || []
  const userAgents = alert.trigger_metadata?.user_agents || []

  const series = triggerList.map((name, idx) => ({
    name,
    count: idx + 1,
  }))

  return (
    <div className="mt-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Recommended Actions</h4>
        </div>
        <ul className="text-zinc-600 dark:text-zinc-400 text-sm space-y-2 list-none pl-1">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            Block unknown source IP ranges at the edge gateway.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            Enable strict authentication and token validation.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            Apply temporary rate limiting and monitor burst traffic.
          </li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-4">Trigger Timeline</h4>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--tw-bg-opacity, white)', borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 500 }}
              />
              <Line type="stepAfter" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-zinc-100 dark:border-zinc-900">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-zinc-500" />
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Source IPs</h4>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {sourceIps.length ? sourceIps.map((ip) => (
              <div key={ip} className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                {ip}
              </div>
            )) : <p className="text-xs text-zinc-400 italic px-1">No IP data recorded</p>}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <UserSquare2 className="w-4 h-4 text-zinc-500" />
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">User Agents</h4>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {userAgents.length ? userAgents.map((ua, i) => (
              <div key={`${ua}-${i}`} className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 truncate" title={ua}>
                {ua || '<empty>'}
              </div>
            )) : <p className="text-xs text-zinc-400 italic px-1">No User Agent data recorded</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
