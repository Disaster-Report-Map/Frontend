import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PublicRoute } from './components/auth/PublicRoute'
import { LoginView } from './views/auth/LoginView'
import { RegisterView } from './views/auth/RegisterView'
import { MapView } from './views/MapView'

function App() {
	return (
		<Routes>
			{/* Public routes - redirect to home if already authenticated */}
			<Route
				path="/login"
				element={
					<PublicRoute>
						<LoginView />
					</PublicRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicRoute>
						<RegisterView />
					</PublicRoute>
				}
			/>
			{/* Protected routes - require authentication */}
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<MapView />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App
