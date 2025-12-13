import axios from 'axios'
import { config } from '../config/env'
import { store } from '../stores/store'
import { clearCredentials } from '../stores/slices/authSlice'

const API_BASE_URL = config.apiBaseUrl

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Enable cookies for session-based reporter ID
})

// Request interceptor - Get token from Redux store
apiClient.interceptors.request.use(
	(config) => {
		const state = store.getState()
		const token = state.auth.token
		if (token) {
			config.headers.Authorization = `Token ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor
apiClient.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		// Handle common errors
		if (error.response?.status === 401) {
			// Handle unauthorized - clear auth state
			store.dispatch(clearCredentials())
		}
		
		return Promise.reject({
			message: error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred',
			code: error.response?.status?.toString(),
			details: error.response?.data,
		})
	}
)

export const handleApiError = (error: unknown): string => {
	if (typeof error === 'string') return error
	if (error && typeof error === 'object' && 'message' in error) {
		return (error as { message: string }).message
	}
	return 'An unexpected error occurred'
}
