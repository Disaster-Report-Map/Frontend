import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'

interface PublicRouteProps {
	children: React.ReactNode
}

/**
 * PublicRoute component that redirects authenticated users away from public pages
 * like login and register to prevent them from accessing these pages when logged in.
 */
export function PublicRoute({ children }: PublicRouteProps) {
	const { isAuthenticated, token } = useAuth()

	// If user is authenticated, redirect to home
	if (token && isAuthenticated) {
		return <Navigate to="/" replace />
	}

	return <>{children}</>
}
