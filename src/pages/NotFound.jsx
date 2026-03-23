import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.jsx';

export default function NotFound({ resolvedTheme }) {
  usePageTitle('404');
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-neutral-200 dark:border-neutral-800 mb-8">
          <Terminal size={24} className={resolvedTheme === 'dark' ? 'text-emerald-500' : 'text-indigo-600'} />
        </div>

        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-4 text-neutral-900 dark:text-white">
          404
        </h1>

        <p className="font-mono text-sm text-neutral-500 mb-2 uppercase tracking-widest">
          Segmentation Fault
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 font-light mb-12">
          The requested address does not exist in this memory space.
        </p>

        <Link
          to="/"
          className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            resolvedTheme === 'dark'
              ? 'bg-white text-black hover:bg-neutral-200'
              : 'bg-neutral-900 text-white hover:bg-neutral-700'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Return to Origin</span>
        </Link>

        <div className="mt-16 font-mono text-[10px] text-neutral-400 dark:text-neutral-700 uppercase tracking-widest">
          Process terminated with exit code 1
        </div>
      </div>
    </div>
  );
}
