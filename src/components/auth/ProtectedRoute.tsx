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
	const { isAuthenticated, token, getCurrentUser, isLoading } = useAuth()
	const location = useLocation()
	const [isValidating, setIsValidating] = useState(false)

	useEffect(() => {
		// If we have a token but no user, try to get current user
		if (token && !isAuthenticated && !isLoading) {
			setIsValidating(true)
			// getCurrentUser returns a thunk action, unwrap it for proper promise handling
			const thunkAction = getCurrentUser()
			if (thunkAction && typeof thunkAction.unwrap === 'function') {
				thunkAction
					.unwrap()
					.then(() => setIsValidating(false))
					.catch(() => setIsValidating(false))
			} else {
				// Fallback if unwrap is not available
				setIsValidating(false)
			}
		}
	}, [token, isAuthenticated, isLoading, getCurrentUser])

	// Show loading state while validating token
	if (isLoading || isValidating) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		)
	}

	// Redirect to login if no token, preserving the intended destination
	if (!token || !isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />
	}

	return <>{children}</>
}

