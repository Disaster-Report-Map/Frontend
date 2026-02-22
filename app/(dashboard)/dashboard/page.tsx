'use client'
import dynamic from 'next/dynamic'
import React, { useMemo, useState, useEffect } from 'react'
import { useIncidents } from '../../../hooks/useIncidents'

// Dynamically import the DisasterMap component to aggressively avoid SSR issues with Leaflet
const DisasterMap = dynamic(() => import('../../../components/map/DisasterMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[600px] w-full bg-slate-900 border border-slate-800 rounded-lg shadow-sm text-slate-400">Loading map...</div>
})

export default function DashboardPage() {
  const { fetchIncidents } = useIncidents()
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)

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
    return [
      { lat: userPos.lat + 0.005, lng: userPos.lng - 0.005, title: "🌊 Flood Level Rising - Sector 4 (Active)" },
      { lat: userPos.lat - 0.010, lng: userPos.lng + 0.008, title: "🔥 Warehouse Fire (Active)" },
      { lat: userPos.lat + 0.015, lng: userPos.lng + 0.015, title: "💥 Multi-vehicle Accident (Pending)" },
      { lat: userPos.lat - 0.005, lng: userPos.lng - 0.015, title: "🚑 Medical Emergency (Resolved)" },
      { lat: userPos.lat, lng: userPos.lng, title: "📍 YOU ARE HERE (Citizen)" }, 
    ]
  }, [userPos])

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden">
      {/* Full screen absolute map underneath */}
      <div className="absolute inset-0 z-0 bg-slate-800/50">
        <DisasterMap
          markers={markers}
          // The radar dynamically acts as a "Disaster Coverage Zone" for the closest active Flood incident in this demo
          radarCenter={userPos ? { lat: userPos.lat + 0.005, lng: userPos.lng - 0.005 } : { lat: 40.7128, lng: -74.0060 }} 
          radarRadiusMeters={1500} // Defines the 1.5km spread of the disaster zone
        />
      </div>

      {/* Floating Panel for Title */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur pb-3 pt-3 px-5 rounded-lg border border-slate-700/50 shadow-xl pointer-events-none">
        <h1 className="text-xl font-bold text-slate-100">Disaster Reports </h1>
        <p className="text-slate-400 text-xs mt-1">Real-time overview around your location.</p>
      </div>
    </div>
  )
}
