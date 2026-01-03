import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
	children: React.ReactNode
}

/**
 * ProtectedRoute component that ensures user is authenticated before rendering children.
 * Redirects to login if no token is present.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, token, getCurrentUser, isLoading, user } = useAuth()
	const location = useLocation()
	const [isValidating, setIsValidating] = useState(false)
	const [hasCheckedToken, setHasCheckedToken] = useState(false)

	useEffect(() => {
		// If we have a token and are authenticated, but no user data, fetch the current user
		if (token && isAuthenticated && !user && !isLoading && !isValidating && !hasCheckedToken) {
			setIsValidating(true)
			setHasCheckedToken(true)
			
			// getCurrentUser returns a thunk action, unwrap it for proper promise handling
			const thunkAction = getCurrentUser()
			if (thunkAction && typeof thunkAction.unwrap === 'function') {
				thunkAction
					.unwrap()
					.then(() => {
						setIsValidating(false)
					})
					.catch(() => {
						setIsValidating(false)
						// Token is invalid, will be cleared by the reducer
					})
			} else {
				// Fallback if unwrap is not available
				setIsValidating(false)
			}
		} else if (!token) {
			// No token, mark as checked
			setHasCheckedToken(true)
		} else if (user || (token && isAuthenticated)) {
			// User exists or we have token and are authenticated, mark as checked
			setHasCheckedToken(true)
		}
	}, [token, user, isAuthenticated, isLoading, isValidating, hasCheckedToken, getCurrentUser])

	// Show loading state while validating token or initial load
	if ((isLoading || isValidating) && !hasCheckedToken) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		)
	}

	// Redirect to login if no token or not authenticated (after checking), preserving the intended destination
	if (hasCheckedToken && (!token || !isAuthenticated)) {
		return <Navigate to="/login" state={{ from: location }} replace />
	}

	return <>{children}</>
}

