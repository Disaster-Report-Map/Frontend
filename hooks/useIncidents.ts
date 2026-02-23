'use client'
import { useCallback } from 'react'
import { incidentsApi } from '../lib/api'
import { useIncidentStore } from '../store/incidentStore'

export function useIncidents() {
  const incidents = useIncidentStore((s) => s.incidents)
  const setIncidents = useIncidentStore((s) => s.setIncidents)
  const addOrUpdate = useIncidentStore((s) => s.addOrUpdate)

  const fetchIncidents = useCallback(async () => {
    try {
      // Temporarily disabled to prevent 404
      // const res = await incidentsApi.list()
      // setIncidents(res.data || [])
    } catch (e) { console.error(e) }
  }, [])

  const addIncident = useCallback(async (payload: any) => {
    const res = await incidentsApi.create(payload)
    addOrUpdate(res.data)
    return res.data
  }, [addOrUpdate])

  const updateIncident = useCallback(async (id: string, payload: any) => {
    const res = await incidentsApi.update(id, payload)
    addOrUpdate(res.data)
    return res.data
  }, [addOrUpdate])

  return { incidents, fetchIncidents, addIncident, updateIncident }
}
