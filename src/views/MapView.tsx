import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { DisasterMap } from '../components/map/DisasterMap'
import { ResponsiveLiveFeed } from '../components/layout/ResponsiveLiveFeed'
import { AlertBanner } from '../components/layout/AlertBanner'
import { FloatingAISummary } from '../components/layout/FloatingAISummary'
import { Modal } from '../components/ui/Modal'
import { WelcomeModal } from '../components/ui/WelcomeModal'
import { ReportForm } from '../components/forms/ReportForm'
import { useReports } from '../hooks/api/useReports'
import { useGeolocation } from '../hooks/geolocation/useGeolocation'
import { useWelcomeModal } from '../hooks/ui/useWelcomeModal'
import type { DisasterReport, Coordinates } from '../types'

export const MapView = () => {
	const [showReportForm, setShowReportForm] = useState(false)
	const [selectedReport, setSelectedReport] = useState<DisasterReport | null>(null)
	const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null)
	const [mapCenter, setMapCenter] = useState<Coordinates | null>(null) // Start with null, will be set by user location
	const [mapZoom, setMapZoom] = useState(13)

	const { data: reportsData } = useReports()
	const { location: userLocation, getCurrentPosition, loading: locationLoading, error: geoError, permission } = useGeolocation()
	const { shouldShow: shouldShowWelcome, markWelcomeModalViewed, hideWelcomeModal } = useWelcomeModal()

	const reports = reportsData?.reports || []
	
	// Request location only once on mount - let the hook handle retries
	useEffect(() => {
		// Only request if we don't have location and permission is not denied
		if (!userLocation && permission !== 'denied' && !locationLoading) {
			getCurrentPosition()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // Only run once on mount

	// Set map to user location on page load with smooth transition
	useEffect(() => {
		if (userLocation) {
			// Add a small delay to ensure the map is fully loaded
			const timer = setTimeout(() => {
				setMapCenter(userLocation)
				setMapZoom(15) // Zoom in more when showing user location
			}, 500)
			
			return () => clearTimeout(timer)
		}
	}, [userLocation])

	// Reset to user location when no report is selected
	useEffect(() => {
		if (userLocation && !selectedReport) {
			setMapCenter(userLocation)
			setMapZoom(15)
		}
	}, [selectedReport, userLocation])

	const handleMapClick = (coordinates: Coordinates) => {
		setSelectedLocation(coordinates)
		setShowReportForm(true)
	}

	const handleReportClick = (report: DisasterReport) => {
		setSelectedReport(report)
		// Center map on the selected report with smooth transition
		setMapCenter(report.location)
		setMapZoom(15) // Zoom in when viewing a specific report
	}

	const handleReportSuccess = () => {
		setShowReportForm(false)
		setSelectedLocation(null)
	}

	const handleReportCancel = () => {
		setShowReportForm(false)
		setSelectedLocation(null)
	}

	const handleWelcomeModalContinue = () => {
		markWelcomeModalViewed()
	}

	const handleWelcomeModalClose = () => {
		hideWelcomeModal()
	}

	return (
		<div className="h-screen flex flex-col bg-gray-50">
			{/* Navbar */}
			<Navbar />

			{/* Main Content */}
			<div className="flex-1 flex overflow-hidden">
				{/* Map */}
				<div className="flex-1 relative">
					{/* Location Loading Indicator */}
					{locationLoading && (
						<div className="absolute top-4 left-4 z-[9999] bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							<span className="text-sm text-gray-700">Getting your location...</span>
						</div>
					)}
					
					{/* Location Error Indicator - Only show if permission is actually denied */}
					{geoError && permission === 'denied' && (
						<div className="absolute top-4 left-4 z-[9999] bg-red-50 border border-red-200 rounded-lg shadow-lg p-3">
							<div className="text-sm text-red-700">
								<p className="font-medium">Location access denied</p>
								<p className="text-xs">Allow location access to see your position on the map</p>
							</div>
						</div>
					)}
					<DisasterMap
						reports={reports}
						userLocation={userLocation}
						onMapClick={handleMapClick}
						selectedReport={selectedReport}
						center={mapCenter || userLocation || { lat: 6.5244, lng: 3.3792 }}
						zoom={mapZoom}
						className="h-full"
					/>

					{/* Floating Report Button */}
					<button
						onClick={() => setShowReportForm(true)}
						className="absolute bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-[9997]"
						aria-label="Report disaster"
					>
						<Plus className="h-6 w-6" />
					</button>
				</div>

				{/* Responsive Live Feed Sidebar */}
				<ResponsiveLiveFeed
					userLocation={userLocation}
					onReportClick={handleReportClick}
					className="h-full"
				/>
			</div>

			{/* Alert Banner */}
			<AlertBanner
				userLocation={userLocation}
				reports={reports}
			/>

			{/* Floating AI Summary Button */}
			<FloatingAISummary />

			{/* Report Form Modal */}
			<Modal
				isOpen={showReportForm}
				onClose={handleReportCancel}
				title="Report Disaster"
				size="lg"
			>
				<ReportForm
					onSuccess={handleReportSuccess}
					onCancel={handleReportCancel}
					initialLocation={selectedLocation}
				/>
			</Modal>

			{/* Welcome Modal */}
			<WelcomeModal
				isOpen={shouldShowWelcome}
				onClose={handleWelcomeModalClose}
				onContinue={handleWelcomeModalContinue}
			/>

		</div>
	)
}
