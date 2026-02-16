import api, { authApi } from './api'
import { User } from '../types/user'

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await authApi.me()
    return res.data as User
  } catch (e) {
    return null
  }
}

export async function loginRequest(payload: { email: string; password: string }) {
  const res = await authApi.login(payload)
  return res.data
}

export async function registerRequest(payload: { name: string; email: string; password: string }) {
  const res = await authApi.register(payload)
  return res.data
}

export async function logoutRequest() { return authApi.logout() }
