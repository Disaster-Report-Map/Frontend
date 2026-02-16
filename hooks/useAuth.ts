'use client'
import React from 'react'
import { fetchCurrentUser, loginRequest, registerRequest, logoutRequest } from '../lib/auth'
import { useAuthStore } from '../store/authStore'
import { initSocket, connectSocket, disconnectSocket } from '../lib/socket'

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  React.useEffect(() => {
    (async () => {
      const u = await fetchCurrentUser()
      setUser(u)
      if (u) {
        initSocket()
        connectSocket()
      }
    })()
    return () => { disconnectSocket() }
  }, [setUser])

  async function login(payload: any) {
    await loginRequest(payload)
    const u = await fetchCurrentUser()
    setUser(u)
    initSocket()
    connectSocket()
  }

  async function register(payload: any) {
    await registerRequest(payload)
    const u = await fetchCurrentUser()
    setUser(u)
    initSocket()
    connectSocket()
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
    disconnectSocket()
  }

  return { user, login, register, logout }
}
