import { MapPin, LogOut, User } from 'lucide-react'
import { getDisasterDisplayName } from '../../utils'
import { useHealthCheck, useReporterId } from '../../hooks/api/useReports'
import { useAuth } from '../../hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom'
import type { DisasterType } from '../../types'

interface NavbarProps {
	className?: string
}

const disasterTypes: { type: DisasterType; icon: React.ReactNode }[] = [
	{ type: 'flood', icon: '🌊' },
	{ type: 'fire', icon: '🔥' },
	{ type: 'accident', icon: '🚑' },
	{ type: 'collapse', icon: '🏚️' },
]

export const Navbar = ({ className }: NavbarProps) => {
	const { data: healthData, isLoading: healthLoading } = useHealthCheck()
	const { data: reporterData } = useReporterId()
	const { user, isAuthenticated, logout } = useAuth()
	const navigate = useNavigate()

	const isBackendConnected = healthData?.status === 'healthy'
	const reporterId = reporterData?.reporter_id

	const handleLogout = async () => {
		await logout()
		navigate('/login')
	}

	return (
		<nav className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
			<div className="flex items-center justify-between">
				{/* Logo and Title */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<MapPin className="h-6 w-6 text-gray-800" />
						<h1 className="text-xl font-bold text-gray-900">
							Disaster Report Map
						</h1>
					</div>
				</div>

				{/* Legend */}
				<div className="hidden md:flex items-center gap-4">
					<span className="text-sm text-gray-600 font-medium">Legend:</span>
					<div className="flex items-center gap-3">
						{disasterTypes.map(({ type, icon }) => (
							<div key={type} className="flex items-center gap-1">
								<span className="text-sm">{icon}</span>
								<span className="text-xs text-gray-600">
									{getDisasterDisplayName(type)}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Status Indicators & Auth */}
				<div className="flex items-center gap-3">
					{/* Backend Status */}
					<div className="flex items-center gap-1 text-sm">
						{healthLoading ? (
							<div className="flex items-center gap-1 text-gray-500">
								<div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
								<span className="hidden sm:inline">Connecting...</span>
							</div>
						) : isBackendConnected ? (
							<div className="flex items-center gap-1 text-green-600">
								<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
								<span className="hidden sm:inline"> Connected</span>
							</div>
						) : (
							<div className="flex items-center gap-1 text-red-600">
								<div className="h-2 w-2 bg-red-500 rounded-full"></div>
								<span className="hidden sm:inline"> Offline</span>
							</div>
						)}
					</div>

					{/* User Info */}
					{isAuthenticated && user ? (
						<div className="flex items-center gap-2">
							<div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
								<User className="h-4 w-4" />
								<span>{user.full_name || user.email}</span>
							</div>
							<button
								onClick={handleLogout}
								className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
								title="Logout"
							>
								<LogOut className="h-4 w-4" />
								<span className="hidden sm:inline">Logout</span>
							</button>
						</div>
					) : (
						<button
							onClick={() => navigate('/login')}
							className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
						>
							Sign In
						</button>
					)}

					{/* Reporter ID */}
					{reporterId && !isAuthenticated && (
						<div className="hidden lg:flex items-center gap-1 text-xs text-gray-500">
							<span>ID: {reporterId.slice(-8)}</span>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Legend */}
			<div className="md:hidden mt-3 pt-3 border-t border-gray-200">
				<div className="flex items-center gap-4 overflow-x-auto">
					<span className="text-sm text-gray-600 font-medium whitespace-nowrap">Legend:</span>
					<div className="flex items-center gap-3">
						{disasterTypes.map(({ type, icon }) => (
							<div key={type} className="flex items-center gap-1 whitespace-nowrap">
								<span className="text-sm">{icon}</span>
								<span className="text-xs text-gray-600">
									{getDisasterDisplayName(type)}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</nav>
	)
}
