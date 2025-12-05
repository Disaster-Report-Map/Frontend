import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User, LoginCredentials, RegisterCredentials, AuthResponse, GoogleSignInResponse } from '../../types/auth'
import * as authApi from '../../api/auth'

const initialState: AuthState = {
	user: null,
	token: localStorage.getItem('auth_token'),
	isAuthenticated: false,
	isLoading: false,
	error: null,
}

// Initialize auth state from localStorage
const token = localStorage.getItem('auth_token')
if (token) {
	initialState.token = token
	initialState.isAuthenticated = true
}

// Async thunks
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authApi.login(credentials)
			return response.data
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.error || 'Login failed')
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
			return rejectWithValue(error.response?.data?.error || 'Registration failed')
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
			return rejectWithValue(error.response?.data?.error || 'Google sign-in failed')
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
			return rejectWithValue(error.response?.data?.error || 'Failed to get user')
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

