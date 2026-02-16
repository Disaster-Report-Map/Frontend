'use client'
import React from 'react'
import { Incident } from '../../types/incident'
import Modal from '../ui/Modal'

function colorForStatus(status: string) {
  switch (status) {
    case 'pending': return 'bg-orange-500'
    case 'active': return 'bg-red-600'
    case 'resolved': return 'bg-green-600'
    case 'verified': return 'bg-blue-600'
    default: return 'bg-gray-500'
  }
}

export default function IncidentMarker({ incident }: { incident: Incident }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="absolute left-0 top-0 pointer-events-auto">
      <div className={`w-4 h-4 rounded-full ${colorForStatus(incident.status)} cursor-pointer`} onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{incident.title}</h3>
          <p className="text-sm text-gray-600">{incident.description}</p>
        </div>
      </Modal>
    </div>
  )
}
