import React, { useState } from 'react';
import { Layers, LocateFixed } from 'lucide-react';

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
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Re-center GPS Button */}
      <button 
        onClick={onRecenter}
        className="w-12 h-12 self-end bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        title="My Location"
      >
        <LocateFixed className="w-6 h-6" />
      </button>

    </div>
  );
}
