import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function initSocket() {
  if (socket) return socket
  socket = io(process.env.NEXT_PUBLIC_WS_URL || '', { autoConnect: false, withCredentials: true })
  return socket
}

export function getSocket() { return socket }

export function connectSocket() { socket?.connect() }
export function disconnectSocket() { socket?.disconnect(); socket = null }
