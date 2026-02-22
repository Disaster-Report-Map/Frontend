'use client';
import React, { useState } from 'react';

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapSearch({ onLocationSelect }: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="absolute top-4 right-4 z-[400] w-full max-w-sm pointer-events-auto">
      <form onSubmit={handleSearch} className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-lg overflow-hidden transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/50">
        <div className="pl-4 pr-2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a location..."
          className="w-full py-3 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm font-medium"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          {loading ? '...' : 'Go'}
        </button>
      </form>
    </div>
  );
}
