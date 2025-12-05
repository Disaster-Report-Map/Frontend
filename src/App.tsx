import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './hooks/auth/useAuth'
import { LoginView } from './views/auth/LoginView'
import { RegisterView } from './views/auth/RegisterView'
import { MapView } from './views/MapView'

function App() {
	const { token, getCurrentUser, isAuthenticated } = useAuth()

	useEffect(() => {
		// Try to get current user if token exists
		if (token && !isAuthenticated) {
			getCurrentUser()
		}
	}, [token, isAuthenticated, getCurrentUser])

	return (
		<Routes>
			<Route path="/login" element={<LoginView />} />
			<Route path="/register" element={<RegisterView />} />
			{/* Map is accessible to everyone, but login is encouraged */}
			<Route path="/" element={<MapView />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App
