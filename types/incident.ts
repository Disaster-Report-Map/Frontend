export type IncidentStatus = 'pending' | 'active' | 'resolved' | 'verified'

export type Incident = {
  id: string
  title: string
  description: string
  category: string
  location: { lat: number; lng: number }
  status: IncidentStatus
  reporterId?: string
  createdAt?: string
  updatedAt?: string
}
