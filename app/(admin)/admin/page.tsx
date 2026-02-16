import React from 'react'
import { useIncidents } from '../../../hooks/useIncidents'

export default function AdminPage() {
  const { incidents, fetchIncidents, updateIncident } = useIncidents()
  React.useEffect(() => { fetchIncidents() }, [fetchIncidents])

  const total = incidents.length
  const active = incidents.filter(i => i.status === 'active').length
  const resolved = incidents.filter(i => i.status === 'resolved').length

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">Total<br/><span className="text-2xl font-bold">{total}</span></div>
        <div className="p-4 bg-white rounded shadow">Active<br/><span className="text-2xl font-bold">{active}</span></div>
        <div className="p-4 bg-white rounded shadow">Resolved<br/><span className="text-2xl font-bold">{resolved}</span></div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Incidents</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500"><th>Title</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {incidents.map(i => (
              <tr key={i.id} className="border-t"><td>{i.title}</td><td>{i.status}</td><td>
                <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => updateIncident(i.id, { status: 'verified' })}>Verify</button>
              </td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
