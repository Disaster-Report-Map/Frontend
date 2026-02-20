import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api

export const authApi = {
  me: () => api.get('/auth/me'),
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout')
}

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
  changePassword: (data: any) => api.put('/users/me/password', data),
}

export const incidentsApi = {

  list: () => api.get('/incidents'),
  create: (payload: any) => api.post('/incidents', payload),
  update: (id: string, payload: any) => api.patch(`/incidents/${id}`, payload),
}
