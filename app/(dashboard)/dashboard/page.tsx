'use client'
import dynamic from 'next/dynamic'
import React, { useMemo, useState, useEffect } from 'react'
import { useIncidents } from '../../../hooks/useIncidents'
import MapSearch from '../../../components/map/MapSearch'
import MapControls from '../../../components/map/MapControls'

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
      // Fallback if location access is denied or still loading (simulating a "flood" and "accident")
      return [
        { lat: 40.7128, lng: -74.0060, title: "🌊 Flood - Downtown (Active)" },
        { lat: 40.7580, lng: -73.9855, title: "💥 Accident - Times Square (Pending)" },
      ]
    }

    // Generate simulated disasters very close to the user's real location based on DRM Doc Schema 4.2
    ]

    // Apply the active dashboard UI filters locally without making new backend requests
    if (activeCategory) {
      return baseMarkers.filter(m => m.category === activeCategory);
    }

    return baseMarkers;
  }, [userPos, activeCategory])

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden">
      {/* Full screen absolute map underneath */}
      <div className="absolute inset-0 z-0 bg-slate-800/50">
        <DisasterMap
          markers={markers}
          forcedCenter={forcedCenter}
          // The radar dynamically acts as a "Disaster Coverage Zone" for the closest active Flood incident in this demo
          radarCenter={userPos ? { lat: userPos.lat + 0.005, lng: userPos.lng - 0.005 } : { lat: 40.7128, lng: -74.0060 }} 
          radarRadiusMeters={1500} // Defines the 1.5km spread of the disaster zone
        />
      </div>

      {/* Floating Panel for Title */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur pb-3 pt-3 px-5 rounded-lg border border-slate-700/50 shadow-xl pointer-events-none hidden md:block">
        <h1 className="text-xl font-bold text-slate-100">Disaster Reports </h1>
        <p className="text-slate-400 text-xs mt-1">Real-time overview of Disaster happening around you</p>
      </div>

      {/* Search Input for Geocoding Locations */}
      <MapSearch onLocationSelect={(lat, lng) => setForcedCenter({ lat, lng })} />

      {/* Interactive Bottom Right Controls */}
      <MapControls 
        categories={['fire', 'flood', 'accident', 'medical']}
        activeCategory={activeCategory}
        onFilterChange={setActiveCategory}
        onRecenter={() => {
          if (userPos) setForcedCenter({ ...userPos });
        }}
      />
    </div>
  )
}
