import axios from 'axios'
import { config } from '../config/env'

const API_BASE_URL = config.apiBaseUrl

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Enable cookies for session-based reporter ID
})

// Request interceptor
apiClient.interceptors.request.use(
	(config) => {
		// Add auth token if available (for future use)
		const token = localStorage.getItem('auth_token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
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
			// Handle unauthorized
			localStorage.removeItem('auth_token')
		}
		
		return Promise.reject({
			message: error.response?.data?.message || error.message || 'An error occurred',
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
