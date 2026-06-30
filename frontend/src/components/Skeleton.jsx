import React from 'react'
import clsx from 'clsx'

export function Skeleton({ className }) {
  return (
    <div className={clsx("animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded", className)} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
         <Skeleton className="h-10 w-64 rounded-lg" />
         <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="p-6 space-y-6">
         {[1,2,3,4,5].map(i => (
           <div key={i} className="flex gap-6 items-center">
             <Skeleton className="h-4 w-1/5" />
             <Skeleton className="h-4 w-1/5" />
             <Skeleton className="h-4 w-1/5" />
             <Skeleton className="h-4 w-1/5" />
             <Skeleton className="h-4 w-1/5" />
           </div>
         ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full flex flex-col">
      <Skeleton className="h-6 w-1/3 mb-6" />
      <div className="flex-1 w-full min-h-[250px] flex items-end gap-2 pb-4">
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <Skeleton key={i} className="w-full rounded-t-sm" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
        ))}
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <TableSkeleton />
    </div>
  )
}
