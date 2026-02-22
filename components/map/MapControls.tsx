'use client';
import React from 'react';

interface MapControlsProps {
  onRecenter: () => void;
  categories: string[];
  activeCategory: string | null;
  onFilterChange: (category: string | null) => void;
}

export default function MapControls({ onRecenter, categories, activeCategory, onFilterChange }: MapControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-auto">
      
      {/* Filters Stack */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <button 
          onClick={() => onFilterChange(null)}
          className={`px-4 py-2 text-sm font-medium border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors ${activeCategory === null ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          🌐 All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`px-4 py-2 text-sm font-medium border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors capitalize ${activeCategory === cat ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            {cat === 'fire' ? '🔥' : cat === 'flood' ? '🌊' : cat === 'medical' ? '🚑' : cat === 'accident' ? '💥' : '📍'} {cat}
          </button>
        ))}
      </div>

      {/* Re-center GPS Button */}
      <button 
        onClick={onRecenter}
        className="w-12 h-12 self-end bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        title="My Location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </button>

    </div>
  );
}
