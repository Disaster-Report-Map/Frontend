import { apiClient } from './client'
import type { LoginCredentials, RegisterCredentials, AuthResponse, GoogleSignInResponse, User } from '../types/auth'

export const login = async (credentials: LoginCredentials) => {
	return apiClient.post<AuthResponse>('/auth/login/', credentials)
}

export const register = async (credentials: RegisterCredentials) => {
	return apiClient.post<AuthResponse>('/auth/register/', credentials)
}

export const googleSignIn = async (token: string) => {
	return apiClient.post<GoogleSignInResponse>('/auth/google/', { token })
}

export const logout = async () => {
	return apiClient.post('/auth/logout/')
}

export const getCurrentUser = async () => {
	return apiClient.get<User>('/auth/me/')
}

