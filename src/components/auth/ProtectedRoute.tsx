import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'
import { useEffect } from 'react'

interface ProtectedRouteProps {
	children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, token, getCurrentUser } = useAuth()

	useEffect(() => {
		// If we have a token but no user, try to get current user
		if (token && !isAuthenticated) {
			getCurrentUser()
		}
	}, [token, isAuthenticated, getCurrentUser])

	if (!token) {
		return <Navigate to="/login" replace />
	}

	return <>{children}</>
}

