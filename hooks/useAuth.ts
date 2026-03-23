'use client'
import React from 'react'
import { fetchCurrentUser, loginRequest, registerRequest, logoutRequest } from '../lib/auth'
import { useAuthStore } from '../store/authStore'
import { initSocket, connectSocket, disconnectSocket } from '../lib/socket'

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  // Initialize store from localStorage on mount
  React.useEffect(() => {
    (async () => {
      if (!user) {
        const u = await fetchCurrentUser()
        if (u) setUser(u)
      }
    })()
  }, [setUser, user])

  // Sync socket with user state
  React.useEffect(() => {
    if (user) {
      initSocket()
      connectSocket()
    } else {
      disconnectSocket()
    }
  }, [user])

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
