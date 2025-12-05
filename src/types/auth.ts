export interface User {
	id: number
	email: string
	first_name: string
	last_name: string
	role: 'citizen' | 'moderator' | 'media' | 'government' | 'security' | 'researcher' | 'admin'
	full_name: string
	date_joined: string
	is_active: boolean
}

export interface AuthState {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}

export interface LoginCredentials {
	email: string
	password: string
}

export interface RegisterCredentials {
	email: string
	password: string
	password_confirm: string
	first_name?: string
	last_name?: string
}

export interface AuthResponse {
	success: boolean
	user: User
	token: string
	message?: string
	created?: boolean
}

export interface GoogleSignInResponse extends AuthResponse {
	created: boolean
}

