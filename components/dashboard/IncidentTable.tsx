'use client'
import React from 'react'
import { Incident } from '../../types/incident'

export default function IncidentTable({ incidents, onVerify }: { incidents: Incident[]; onVerify?: (id: string) => void }) {
  return (
    <table className="min-w-full bg-white dark:bg-gray-800">
      <thead>
        <tr><th className="p-2">Title</th><th className="p-2">Status</th><th className="p-2">Action</th></tr>
      </thead>
      <tbody>
        {incidents.map(i => (
          <tr key={i.id} className="border-t"><td className="p-2">{i.title}</td><td className="p-2">{i.status}</td>
            <td className="p-2"><button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => onVerify?.(i.id)}>Verify</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
