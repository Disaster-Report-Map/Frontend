'use client'
import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'
import { useIncidents } from '../../../hooks/useIncidents'

// Dynamically import the DisasterMap component to aggressively avoid SSR issues with Leaflet
const DisasterMap = dynamic(() => import('../../../components/map/DisasterMap'), {
  ssr: false,
})

export default function DashboardPage() {
  const { incidents, fetchIncidents } = useIncidents()

  React.useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  // Convert incidents array to the MapMarker array expected by DisasterMap
  const markers = useMemo(() => {
    return incidents.map((inc) => ({
      lat: inc.location.lat,
      lng: inc.location.lng,
      title: inc.title,
    }))
  }, [incidents])

  return (
    <div className="h-[80vh] rounded-lg shadow-sm border border-gray-100 overflow-hidden bg-white p-2">
      <DisasterMap
        markers={markers}
        // Optional radar overlay can be enabled for demonstration or when tracking active issues
        // radarCenter={{ lat: 51.505, lng: -0.09 }}
        // radarRadiusMeters={2000}
      />
    </div>
  )
}
