'use client'
import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'
import { useIncidents } from '../../../hooks/useIncidents'

// Dynamically import the DisasterMap component to aggressively avoid SSR issues with Leaflet
const DisasterMap = dynamic(() => import('../../../components/map/DisasterMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full w-full bg-slate-900 border border-slate-800 rounded-lg shadow-sm text-slate-400">Loading map...</div>
})

// DUMMY DATA FOR VISUAL TESTING
const DUMMY_INCIDENTS = [
  { lat: 40.7128, lng: -74.0060, title: "Major Flooding - Downtown" },
  { lat: 40.7580, lng: -73.9855, title: "Blocked Road - Times Square" },
  { lat: 40.7829, lng: -73.9654, title: "Fallen Trees - Central Park" },
  { lat: 40.7061, lng: -73.9969, title: "Power Outage - Brooklyn Bridge" }
]

export default function DashboardPage() {
  const { fetchIncidents } = useIncidents()

  React.useEffect(() => {
    // We still call this so when backend is ready, data starts fetching
    fetchIncidents()
  }, [fetchIncidents])

  // Temporarily use DUMMY_INCIDENTS instead of the real backend `incidents`
  const markers = useMemo(() => {
    return DUMMY_INCIDENTS.map((inc) => ({
      lat: inc.lat,
      lng: inc.lng,
      title: inc.title,
    }))
  }, [])

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Live Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time overview of reported disasters and incidents. (Dummy Data Active)</p>
      </div>

      <div className="flex-1 min-h-[60vh] rounded-xl shadow-lg border border-slate-700/50 overflow-hidden bg-slate-800/50 relative">
        <DisasterMap
          markers={markers}
          // The radar gives a cool visual effect tracking a coverage radius
          radarCenter={{ lat: 40.7580, lng: -73.9855 }} 
          radarRadiusMeters={3000} // 3km radius
        />
      </div>
    </div>
  )
}
