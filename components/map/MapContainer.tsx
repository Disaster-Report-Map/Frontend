'use client'
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { Incident } from '../../types/incident'
import IncidentMarker from './IncidentMarker'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function MapContainer({ incidents }: { incidents: Incident[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 20],
      zoom: 2,
    })
    return () => mapInstance.current?.remove()
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return
    // optional: fit bounds to incidents
  }, [incidents])

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      {/* markers rendered as overlay DOM nodes */}
      <div className="pointer-events-none absolute inset-0">
        {incidents.map((inc) => (
          <IncidentMarker key={inc.id} incident={inc} map={mapInstance.current} />
        ))}
      </div>
    </div>
  )
}
