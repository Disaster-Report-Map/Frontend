import create from 'zustand'
import { User } from '../types/user'

type AuthState = {
  user: User | null
  setUser: (u: User | null) => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  isAuthenticated: () => !!get().user,
}))
