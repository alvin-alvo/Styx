import React from 'react';
import { Info } from 'lucide-react';

export default function InfoTooltip({ text }) {
  return (
    <div className="relative group inline-flex items-center ml-2">
      <Info className="w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-help" />
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-normal rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[99] pointer-events-none whitespace-normal text-center leading-relaxed">
        {text}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-900 dark:border-b-zinc-100"></div>
      </div>
    </div>
  );
}
