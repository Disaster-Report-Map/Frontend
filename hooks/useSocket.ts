'use client'
import { useEffect } from 'react'
import { initSocket, getSocket } from '../lib/socket'
import { useIncidentStore } from '../store/incidentStore'

export function useSocket() {
  const addOrUpdate = useIncidentStore((s) => s.addOrUpdate)

  useEffect(() => {
    const socket = initSocket()
    socket.on('connect', () => { console.debug('socket connected') })

    socket.on('incident_created', (payload: any) => addOrUpdate(payload))
    socket.on('incident_updated', (payload: any) => addOrUpdate(payload))
    socket.on('incident_status_changed', (payload: any) => addOrUpdate(payload))
    socket.on('incident_verified', (payload: any) => addOrUpdate(payload))

    return () => {
      socket.off('incident_created')
      socket.off('incident_updated')
      socket.off('incident_status_changed')
      socket.off('incident_verified')
    }
  }, [addOrUpdate])

  return { socket: getSocket() }
}
