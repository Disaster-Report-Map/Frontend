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

  // Temporarily generate dummy data dynamically AROUND the user's actual location
  const markers = useMemo(() => {
    if (!userPos) {
      // Fallback if location access is denied or still loading
      return [
        { lat: 40.7128, lng: -74.0060, title: "Major Flooding - Downtown" },
        { lat: 40.7580, lng: -73.9855, title: "Blocked Road - Times Square" },
      ]
    }

    // Generate simulated disasters very close to the user's real location
    return [
      { lat: userPos.lat + 0.005, lng: userPos.lng - 0.005, title: "⚠️ Reported Flooding" },
      { lat: userPos.lat - 0.010, lng: userPos.lng + 0.008, title: "⚡ Power Outage" },
      { lat: userPos.lat + 0.015, lng: userPos.lng + 0.015, title: "🌲 Fallen Trees" },
      { lat: userPos.lat, lng: userPos.lng, title: "📍 YOU ARE HERE" }, 
    ]
  }, [userPos])

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Live Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time overview of reported disasters around your location.</p>
      </div>

      <div className="w-full bg-slate-800/50 relative">
        <DisasterMap
          markers={markers}
          // The radar dynamically centers exactly on the user if we have their location
          radarCenter={userPos ? userPos : { lat: 40.7128, lng: -74.0060 }} 
          radarRadiusMeters={3000} // 3km radius
        />
      </div>
    </div>
  )
}
