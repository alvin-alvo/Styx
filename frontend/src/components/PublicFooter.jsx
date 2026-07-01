import React from 'react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © 2026 Styx
        </p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <a 
            href="https://www.unionbankofindia.bank.in/en/common/privacypolicy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Terms
          </a>
          <a 
            href="https://www.unionbankofindia.bank.in/en/common/privacypolicy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
