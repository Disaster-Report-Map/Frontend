import type { Middleware } from '@reduxjs/toolkit'

/**
 * Middleware to sync auth token with localStorage
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
	const result = next(action)

	// Sync token to localStorage when auth state changes
	if (action && typeof action === 'object' && 'type' in action && typeof action.type === 'string' && action.type.startsWith('auth/')) {
		const state = store.getState() as { auth: { token: string | null } }
		const token = state.auth.token

		if (token) {
			localStorage.setItem('auth_token', token)
		} else {
			localStorage.removeItem('auth_token')
		}
	}

	return result
}

