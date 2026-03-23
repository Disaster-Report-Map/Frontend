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
    // Skip token for auth endpoints to avoid issues with expired tokens on login/reg
    const isAuthRoute = config.url?.includes('/api/auth/login/') || config.url?.includes('/api/auth/register/')
    if (isAuthRoute) return config

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
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
    
    // Explicitly do not attempt refresh for login/register endpoints that fail with 401
    const isAuthRoute = originalRequest.url?.includes('/api/auth/login/') || originalRequest.url?.includes('/api/auth/register/')
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
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
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
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

export const userApi = {
  getProfile: () => api.get('/api/users/me/'),
  updateProfile: (data: any) => api.patch('/api/users/me/', data),
  changePassword: (data: any) => api.put('/api/users/me/password/', data),
  deleteAccount: () => api.delete('/api/users/me/'),
}

export const incidentsApi = {
  list: () => api.get('/api/incidents/'),
  create: (payload: any) => api.post('/api/incidents/', payload),
  update: (id: string, payload: any) => api.patch(`/api/incidents/${id}/`, payload),
}
