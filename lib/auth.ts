import { authApi } from './api'
import { User } from '../types/user'

export async function fetchCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') return null
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (e) {
    return null
  }
}

export async function loginRequest(payload: { email: string; password: string }) {
  const res = await authApi.login(payload)
  const { access, refresh, user } = res.data
  
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
  if (user) localStorage.setItem('user', JSON.stringify(user))
  
  return res.data
}

export async function registerRequest(payload: any) {
  const res = await authApi.register(payload)
  const { access, refresh, user } = res.data
  
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
  if (user) localStorage.setItem('user', JSON.stringify(user))
  
  return res.data
}

export async function logoutRequest() {
  const refresh = localStorage.getItem('refresh_token')
  if (refresh) {
    try {
      await authApi.logout(refresh)
    } catch (e) {
      console.warn('Logout request failed', e)
    }
  }
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}
