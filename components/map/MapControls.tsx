import React, { useState } from 'react';

interface MapControlsProps {
  onRecenter: () => void;
  categories: string[];
  activeCategory: string | null;
  onFilterChange: (category: string | null) => void;
}

export default function MapControls({ onRecenter, categories, activeCategory, onFilterChange }: MapControlsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Filters Dropdown */}
      <div className="relative flex flex-col items-end">
        {expanded && (
          <div className="absolute bottom-[3.5rem] right-0 mb-3 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button 
              onClick={() => { onFilterChange(null); setExpanded(false); }}
              className={`px-4 py-3 text-sm font-medium border-b border-slate-800 last:border-0 transition-colors flex items-center gap-3 ${activeCategory === null ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <span>🌐</span> <span>All Groups</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { onFilterChange(cat); setExpanded(false); }}
                className={`px-4 py-3 text-sm font-medium border-b border-slate-800 last:border-0 transition-colors capitalize flex items-center gap-3 ${activeCategory === cat ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>{cat === 'fire' ? '🔥' : cat === 'flood' ? '🌊' : cat === 'medical' ? '🚑' : cat === 'accident' ? '💥' : cat === 'earthquake' ? '📍' : '⚠️'}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filter Toggle Button */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className={`w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 border border-slate-700 ${activeCategory ? 'ring-2 ring-blue-500' : ''}`}
          title="Filter Incidents"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
        </button>
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
