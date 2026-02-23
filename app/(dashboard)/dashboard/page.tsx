'use client'
import dynamic from 'next/dynamic'
import React, { useMemo, useState, useEffect } from 'react'
import { useIncidents } from '../../../hooks/useIncidents'
import MapSearch from '../../../components/map/MapSearch'
import MapControls from '../../../components/map/MapControls'
import { toast } from 'sonner'

// Dynamically import the DisasterMap component to aggressively avoid SSR issues with Leaflet
const DisasterMap = dynamic(() => import('../../../components/map/DisasterMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[600px] w-full bg-slate-900 border border-slate-800 rounded-lg shadow-sm text-slate-400">Loading map...</div>
})

export default function DashboardPage() {
  const { fetchIncidents } = useIncidents()
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  
  // Google Maps Style feature states
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [forcedCenter, setForcedCenter] = useState<{ lat: number; lng: number } | null>(null)
  
  // Click-to-report feature states
  const [draftLocation, setDraftLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [reportForm, setReportForm] = useState({ title: '', category: 'other' })
  const [dynamicMarkers, setDynamicMarkers] = useState<any[]>([])

  // Load from local storage initially
  useEffect(() => {
    try {
      const saved = localStorage.getItem('drm_local_reports')
      if (saved) setDynamicMarkers(JSON.parse(saved))
    } catch (e) {
      console.warn('Failed to parse local reports', e)
    }
  }, [])

  useEffect(() => {
    // We still call this so when backend is ready, data starts fetching
    fetchIncidents()

    // Fetch user's real-time location via browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
        },
        (error) => console.error("Geolocation denied or failed", error),
        { enableHighAccuracy: true }
      )
    }
  }, [fetchIncidents])

  // Generate dummy data dynamically AROUND the user's actual location based on DRM documentation roles
  const markers = useMemo(() => {
    if (!userPos) {
      return []
    }

    // Generate simulated disasters very close to the user's real location based on DRM Doc Schema 4.2
    const baseMarkers = [
      { lat: userPos.lat + 0.005, lng: userPos.lng - 0.005, title: "Flood Level Rising - Sector 4", category: "flood", status: "active" },
      { lat: userPos.lat - 0.010, lng: userPos.lng + 0.008, title: "Warehouse Fire", category: "fire", status: "active" },
      { lat: userPos.lat + 0.015, lng: userPos.lng + 0.015, title: "Multi-vehicle Accident", category: "accident", status: "pending" },
      { lat: userPos.lat - 0.005, lng: userPos.lng - 0.015, title: "Medical Emergency", category: "medical", status: "resolved" },
      { lat: userPos.lat + 0.001, lng: userPos.lng + 0.002, title: "Secondary Flooding", category: "flood", status: "active" },
      { lat: userPos.lat - 0.002, lng: userPos.lng - 0.001, title: "Chemical Fire Exposure", category: "fire", status: "active" },
      { lat: userPos.lat + 0.003, lng: userPos.lng - 0.003, title: "Highway Collision", category: "accident", status: "active" },
      { lat: userPos.lat - 0.004, lng: userPos.lng + 0.004, title: "Heart Attack Report", category: "medical", status: "pending" },
      ...dynamicMarkers
    ]

    // Apply the active dashboard UI filters locally without making new backend requests
    if (activeCategory) {
      return baseMarkers.filter(m => m.category === activeCategory);
    }

    return baseMarkers;
  }, [userPos, activeCategory, dynamicMarkers])

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draftLocation || !reportForm.title) return

    const newReport = { 
      lat: draftLocation.lat, 
      lng: draftLocation.lng, 
      title: reportForm.title, 
      category: reportForm.category, 
      status: "active" 
    };

    setDynamicMarkers((prev) => {
      const updated = [...prev, newReport];
      try {
        localStorage.setItem('drm_local_reports', JSON.stringify(updated));
      } catch (e) { console.warn('Local storage write fail', e) }
      return updated;
    });

    toast.success(`Uploaded ${reportForm.category.toUpperCase()} Report ${reportForm.title}`, {
      description: "Added to your library."
    });

    // Reset draft and form
    setDraftLocation(null)
    setReportForm({ title: '', category: 'other' })
  }

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden font-sans">
      {/* Full screen absolute map underneath */}
      <div className="absolute inset-0 z-0 bg-slate-800/50">
        <DisasterMap
          markers={markers}
          forcedCenter={forcedCenter}
          onMapClick={(lat, lng) => setDraftLocation({ lat, lng })}
          draftReportLocation={draftLocation}
          userLocation={userPos} // Explicit new beacon
          dynamicRadars={dynamicMarkers} // Provide the 2m warning radars around reports
          // The radar dynamically acts as a "Disaster Coverage Zone" for the closest active Flood incident in this demo
          radarCenter={userPos ? { lat: userPos.lat + 0.005, lng: userPos.lng - 0.005 } : { lat: 40.7128, lng: -74.0060 }} 
          radarRadiusMeters={1500} // Defines the 1.5km spread of the disaster zone
        />
      </div>

      {/* Floating Panel for Title */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur py-2 px-3 sm:py-3 sm:px-5 rounded-lg border border-slate-700/50 shadow-xl pointer-events-none max-w-[200px] sm:max-w-xs transition-opacity duration-300">
        <h1 className="text-sm sm:text-xl font-bold text-slate-100 leading-tight">Disaster Reports</h1>
        <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 leading-snug">Real-time overview of Disasters happening around you</p>
      </div>

      {/* Search Input for Geocoding Locations */}
      <MapSearch onLocationSelect={(lat, lng) => setForcedCenter({ lat, lng })} />

      {/* Interactive Bottom Right Controls */}
      <MapControls 
        categories={['fire', 'flood', 'accident', 'medical', 'earthquake']}
        activeCategory={activeCategory}
        onFilterChange={setActiveCategory}
        onRecenter={() => {
          if (navigator.geolocation) {
            toast.loading("Locating you...", { id: "gps" });
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserPos({ lat: latitude, lng: longitude });
                
                // We add a tiny randomized offset to the timestamp so React ALWAYS respects it as a new distinct object reference 
                // to explicitly trigger the exact same [forcedCenter] useEffect dependency inside DisasterMap.tsx
                setForcedCenter({ lat: latitude, lng: longitude, t: Date.now() } as any);
                toast.success("Location updated", { id: "gps" });
              },
              (err) => {
                toast.error("Please allow location access.", { id: "gps" });
                console.warn(err);
              },
              { enableHighAccuracy: true }
            );
          } else {
            toast.error("Geolocation not supported.", { id: "gps" });
          }
        }}
      />

      {/* Click-to-Report Floating Modal */}
      {draftLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-[1000] p-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Report Incident</h2>
            <button 
              onClick={() => setDraftLocation(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Location locked at: {draftLocation.lat.toFixed(4)}, {draftLocation.lng.toFixed(4)}
          </p>

          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Disaster Type</label>
              <select 
                value={reportForm.category}
                onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fire">🔥 Fire</option>
                <option value="flood">🌊 Flood</option>
                <option value="earthquake">⛰️ Earthquake</option>
                <option value="accident">💥 Traffic Accident</option>
                <option value="medical">🚑 Medical Emergency</option>
                <option value="other">⚠️ Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input 
                type="text"
                required
                placeholder="Brief description (e.g., Heavy flooding on Main St)"
                value={reportForm.title}
                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                type="button" 
                onClick={() => setDraftLocation(null)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
