'use client';
import React, { useState } from 'react';

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapSearch({ onLocationSelect }: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Free OpenStreetMap Geocoding API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        // Grab the best match
        const { lat, lon } = data[0];
        onLocationSelect(parseFloat(lat), parseFloat(lon));
        setExpanded(false); // Auto-collapse on mobile after search
      } else {
        alert("Location not found. Try a broader search.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`absolute top-4 right-4 z-[500] pointer-events-auto transition-all duration-300 ease-in-out ${expanded ? 'w-[calc(100vw-2rem)] md:w-full md:max-w-sm' : 'w-12 md:w-full md:max-w-sm max-w-sm'}`}>
      <form onSubmit={handleSearch} className={`relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 shadow-lg overflow-hidden transition-all duration-300 ${expanded ? 'rounded-lg' : 'rounded-full md:rounded-lg'}`}>
        <button 
          type="button"
          onClick={() => setExpanded(true)}
          title="Search Location"
          className={`shrink-0 flex items-center justify-center w-12 h-12 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ${expanded ? 'pointer-events-none' : 'md:pointer-events-none'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
        
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an address..."
          className={`py-3 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm font-medium transition-all duration-300 ${expanded ? 'w-full opacity-100 pl-1' : 'w-0 opacity-0 p-0 md:w-full md:opacity-100 md:pl-1'}`}
        />
        
        <button 
          type="submit" 
          disabled={loading || !query}
          className={`shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-300 disabled:bg-slate-300 dark:disabled:bg-slate-700 ${expanded ? 'px-4 py-3 opacity-100' : 'w-0 opacity-0 px-0 py-0 md:px-4 md:py-3 md:opacity-100 md:w-auto'}`}
        >
          {loading ? '...' : 'Go'}
        </button>

        {expanded && (
          <button 
             type="button" 
             onClick={() => { setExpanded(false); setQuery(''); }}
             className="md:hidden shrink-0 flex items-center justify-center px-4 py-3 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 dark:bg-slate-800"
          >
             ✕
          </button>
        )}
      </form>
    </div>
  );
}
