'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import MapContainer from '../../../components/map/MapContainer'
import { useIncidents } from '../../../hooks/useIncidents'

const FullMap = dynamic(() => Promise.resolve(MapContainer), { ssr: false })

export default function DashboardPage() {
  const { incidents, fetchIncidents } = useIncidents()

  React.useEffect(() => { fetchIncidents() }, [fetchIncidents])

  return (
    <div className="h-[80vh] rounded overflow-hidden">
      <FullMap incidents={incidents} />
    </div>
  )
}
