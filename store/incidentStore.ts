import create from 'zustand'
import { Incident } from '../types/incident'

type IncidentState = {
  incidents: Incident[]
  setIncidents: (arr: Incident[]) => void
  addOrUpdate: (inc: Incident) => void
  remove: (id: string) => void
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  setIncidents: (arr) => set({ incidents: arr }),
  addOrUpdate: (inc) => set((s) => ({ incidents: [inc, ...s.incidents.filter(i => i.id !== inc.id)] })),
  remove: (id) => set((s) => ({ incidents: s.incidents.filter(i => i.id !== id) })),
}))
