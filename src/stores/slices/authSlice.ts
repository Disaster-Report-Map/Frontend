import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User, LoginCredentials, RegisterCredentials, AuthResponse, GoogleSignInResponse } from '../../types/auth'
import * as authApi from '../../api/auth'

// Initialize auth state from localStorage
const token = localStorage.getItem('auth_token')
const initialState: AuthState = {
	user: null,
	token: token,
	isAuthenticated: !!token, // Set to true if token exists
	isLoading: false,
	error: null,
}

/**
 * Helper function to extract error message from Django REST Framework error response
 */
const extractErrorMessage = (error: any): string => {
	if (!error?.response?.data) {
		return error?.message || 'An unexpected error occurred'
	}

	const data = error.response.data

	// Check for direct error message
	if (typeof data.error === 'string') {
		return data.error
	}

	// Check for non_field_errors (common in DRF)
	if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
		return data.non_field_errors[0]
	}

	// Check for field-specific errors
	if (typeof data === 'object') {
		const firstError = Object.values(data).find((val) => Array.isArray(val) && val.length > 0)
		if (Array.isArray(firstError) && firstError.length > 0) {
			return String(firstError[0])
		}
	}

	// Fallback to message or default
	return data.message || data.detail || 'An error occurred'
}

// Async thunks
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authApi.login(credentials)
			return response.data
		} catch (error: any) {
			return rejectWithValue(extractErrorMessage(error))
		}
	}
)

export const register = createAsyncThunk<AuthResponse, RegisterCredentials>(
	'auth/register',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authApi.register(credentials)
			return response.data
		} catch (error: any) {
			return rejectWithValue(extractErrorMessage(error))
		}
	}
)

export const googleSignIn = createAsyncThunk<GoogleSignInResponse, string>(
	'auth/googleSignIn',
	async (token, { rejectWithValue }) => {
		try {
			const response = await authApi.googleSignIn(token)
			return response.data
		} catch (error: any) {
			return rejectWithValue(extractErrorMessage(error))
		}
	}
)

export const getCurrentUser = createAsyncThunk<User, void>(
	'auth/getCurrentUser',
	async (_, { rejectWithValue, getState }) => {
		try {
			const state = getState() as { auth: AuthState }
			if (!state.auth.token) {
				throw new Error('No token available')
			}
			const response = await authApi.getCurrentUser()
			return response.data
		} catch (error: any) {
			return rejectWithValue(extractErrorMessage(error))
		}
	}
)

export const logout = createAsyncThunk<void, void>(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			await authApi.logout()
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.error || 'Logout failed')
		}
	}
)

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
			state.user = action.payload.user
			state.token = action.payload.token
			state.isAuthenticated = true
			state.error = null
			localStorage.setItem('auth_token', action.payload.token)
		},
		clearCredentials: (state) => {
			state.user = null
			state.token = null
			state.isAuthenticated = false
			state.error = null
			localStorage.removeItem('auth_token')
		},
		clearError: (state) => {
			state.error = null
		},
	},
	extraReducers: (builder) => {
		// Login
		builder
			.addCase(login.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false
				state.user = action.payload.user
				state.token = action.payload.token
				state.isAuthenticated = true
				state.error = null
				localStorage.setItem('auth_token', action.payload.token)
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Register
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false
				state.user = action.payload.user
				state.token = action.payload.token
				state.isAuthenticated = true
				state.error = null
				localStorage.setItem('auth_token', action.payload.token)
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Google Sign-In
		builder
			.addCase(googleSignIn.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(googleSignIn.fulfilled, (state, action) => {
				state.isLoading = false
				state.user = action.payload.user
				state.token = action.payload.token
				state.isAuthenticated = true
				state.error = null
				localStorage.setItem('auth_token', action.payload.token)
			})
			.addCase(googleSignIn.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload as string
			})

		// Get Current User
		builder
			.addCase(getCurrentUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getCurrentUser.fulfilled, (state, action) => {
				state.isLoading = false
				state.user = action.payload
				state.isAuthenticated = true
			})
			.addCase(getCurrentUser.rejected, (state) => {
				state.isLoading = false
				state.isAuthenticated = false
				state.token = null
				state.user = null
				localStorage.removeItem('auth_token')
			})

		// Logout
		builder
			.addCase(logout.pending, (state) => {
				state.isLoading = true
			})
			.addCase(logout.fulfilled, (state) => {
				state.isLoading = false
				state.user = null
				state.token = null
				state.isAuthenticated = false
				state.error = null
				localStorage.removeItem('auth_token')
			})
			.addCase(logout.rejected, (state) => {
				state.isLoading = false
				// Clear state even if logout API call fails
				state.user = null
				state.token = null
				state.isAuthenticated = false
				localStorage.removeItem('auth_token')
			})
	},
})

export const { setCredentials, clearCredentials, clearError } = authSlice.actions
export default authSlice.reducer

