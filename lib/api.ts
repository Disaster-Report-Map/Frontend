import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')

        const res = await axios.post(`${api.defaults.baseURL}/api/auth/refresh-token/`, { refresh })
        const { access } = res.data
        localStorage.setItem('access_token', access)
        
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authApi = {
  login: (data: any) => api.post('/api/auth/login/', data),
  register: (data: any) => api.post('/api/auth/register/', data),
  logout: (refresh: string) => api.post('/api/auth/logout/', { refresh }),
  refresh: (refresh: string) => api.post('/api/auth/refresh-token/', { refresh }),
  googleAuth: (data: any) => api.post('/api/auth/google-auth/', data)
}

export const incidentsApi = {
  list: () => api.get('/api/incidents/'),
  create: (payload: any) => api.post('/api/incidents/', payload),
  update: (id: string, payload: any) => api.patch(`/api/incidents/${id}/`, payload),
}
