import React from 'react'
import { formatDate } from '../utils/formatters'
import AlertDetail from './AlertDetail'
import { RefreshCcw, EyeOff, ShieldAlert, Bell, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'

export default function AlertsFeed({ alerts, onAcknowledge }) {
  const [expandedAlertId, setExpandedAlertId] = React.useState(null)
  
  const getAlertIcon = (type) => {
    switch (type) {
      case 'ZOMBIE_RESURRECTION':
        return <RefreshCcw className="w-5 h-5 text-amber-500" />
      case 'SHADOW_DISCOVERED':
        return <EyeOff className="w-5 h-5 text-blue-500" />
      case 'SECURITY_VIOLATION':
        return <ShieldAlert className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-zinc-500" />
    }
  }

  const getAlertTitle = (type) => {
    switch (type) {
      case 'ZOMBIE_RESURRECTION':
        return 'Zombie API Resurrection'
      case 'SHADOW_DISCOVERED':
        return 'Shadow API Discovered'
      case 'SECURITY_VIOLATION':
        return 'Security Violation'
      default:
        return 'Alert'
    }
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50'
      case 'HIGH':
        return 'bg-orange-50/50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-900/50'
      case 'MEDIUM':
        return 'bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/50'
      default:
        return 'bg-zinc-50/50 border-zinc-200 dark:bg-zinc-900/10 dark:border-zinc-800'
    }
  }
  
  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
        <Bell className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-medium">No alerts detected</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-xl transition-all duration-200 ${getSeverityClass(alert.severity)} ${
            alert.acknowledged ? 'opacity-60 grayscale-[0.5]' : 'shadow-sm'
          }`}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-0.5 p-2 bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800 shrink-0">
                {getAlertIcon(alert.alert_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">{getAlertTitle(alert.alert_type)}</h3>
                  {alert.acknowledged && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Ack
                    </span>
                  )}
                </div>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">
                  API Endpoint: <span className="font-mono text-zinc-900 dark:text-zinc-300 font-medium">{alert.api_id.substring(0, 8)}...</span>
                </p>
                
                {alert.trigger_metadata?.triggers && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {alert.trigger_metadata.triggers.map((trigger) => (
                      <span
                        key={trigger}
                        className="px-2 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded-md font-mono"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">{formatDate(alert.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-start sm:ml-4 shrink-0 mt-3 sm:mt-0">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getSeverityBadgeClass(alert.severity)}`}>
                {alert.severity}
              </span>
              
              <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium rounded-md text-sm transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                <button
                  onClick={() => setExpandedAlertId((prev) => (prev === alert.id ? null : alert.id))}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-zinc-900"
                  title={expandedAlertId === alert.id ? "Show less" : "Show more"}
                >
                  {expandedAlertId === alert.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          {expandedAlertId === alert.id && (
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-2">
              <AlertDetail alert={alert} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
