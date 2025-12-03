import { useState } from 'react'
import { RefreshCw, Filter, X, List, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { DisasterCard } from '../map/DisasterCard'
import { useReports } from '../../hooks/api/useReports'
import { getDisasterDisplayName } from '../../utils'
import type { DisasterReport, DisasterType, UserLocation } from '../../types'
import { cn } from '../../utils/cn'

interface ResponsiveLiveFeedProps {
	userLocation: UserLocation | null
	onReportClick?: (report: DisasterReport) => void
	className?: string
}

const disasterTypes: DisasterType[] = ['flood', 'fire', 'accident', 'collapse']

export const ResponsiveLiveFeed = ({ userLocation, onReportClick, className }: ResponsiveLiveFeedProps) => {
	const [selectedTypes, setSelectedTypes] = useState<DisasterType[]>([])
	const [showFilters, setShowFilters] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(false) // New state for desktop collapse
	const [radiusFilter, setRadiusFilter] = useState<number | null>(null)
	
	const { data: reportsData, isLoading, error, refetch, isFetching } = useReports()

	const reports = (reportsData as any)?.reports || []
	
	// Debug logging
	console.log('ResponsiveLiveFeed state:', {
		userLocation,
		radiusFilter,
		selectedTypes,
		reportsCount: reports.length
	})

	// Calculate distance between two points in kilometers
	const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
		const R = 6371 // Earth's radius in kilometers
		const dLat = (lat2 - lat1) * Math.PI / 180
		const dLng = (lng2 - lng1) * Math.PI / 180
		const a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
			Math.sin(dLng/2) * Math.sin(dLng/2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
		return R * c
	}

	// Filter reports by selected types and radius
	const filteredReports = reports.filter((report: any) => {
		// Type filter
		const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(report.type)
		
		// Radius filter
		let radiusMatch = true
		if (radiusFilter && userLocation) {
			const distance = calculateDistance(
				userLocation.lat, 
				userLocation.lng, 
				report.location.lat, 
				report.location.lng
			)
			radiusMatch = distance <= radiusFilter
			console.log(`Report ${report.id}: distance=${distance.toFixed(2)}km, radius=${radiusFilter}km, match=${radiusMatch}`)
		}
		
		return typeMatch && radiusMatch
	})

	const toggleTypeFilter = (type: DisasterType) => {
		setSelectedTypes(prev => 
			prev.includes(type) 
				? prev.filter(t => t !== type)
				: [...prev, type]
		)
	}

	const clearFilters = () => {
		setSelectedTypes([])
		setRadiusFilter(null)
	}

	const getTypeCount = (type: DisasterType) => {
		return reports.filter((report: any) => report.type === type).length
	}

	const handleReportClick = (report: DisasterReport) => {
		onReportClick?.(report)
		// Close sidebar on mobile after clicking
		if (window.innerWidth < 768) {
			setIsOpen(false)
		}
	}

	return (
		<>
			{/* Mobile Floating Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="md:hidden fixed bottom-20 left-6 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-[9997]"
				aria-label="View reports"
			>
				<List className="h-5 w-5" />
			</button>

			{/* Desktop Sidebar */}
			<div className={cn('hidden md:flex bg-white border-l border-gray-200 flex-col h-full', isCollapsed ? 'w-16' : 'w-[30%]', className)}>
				{/* Header */}
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center justify-between mb-3">
						{!isCollapsed && <h2 className="text-lg font-semibold text-gray-900">Live Feed</h2>}
						<div className="flex items-center gap-2">
							{!isCollapsed && (
								<>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShowFilters(!showFilters)}
										className={cn(
											'h-8 w-8 p-0',
											showFilters && 'bg-gray-100'
										)}
									>
										<Filter className="h-4 w-4" />
									</Button>
									
									<Button
										variant="ghost"
										size="sm"
										onClick={() => refetch()}
										loading={isFetching}
										className="h-8 w-8 p-0"
									>
										<RefreshCw className="h-4 w-4" />
									</Button>
								</>
							)}
							
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsCollapsed(!isCollapsed)}
								className="h-8 w-8 p-0"
							>
								{isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
							</Button>
						</div>
					</div>

					{/* Stats */}
					{!isCollapsed && (
						<div className="text-sm text-gray-600">
							{isLoading ? (
								'Loading reports...'
							) : (
								<>
									{filteredReports.length} of {reports.length} reports
									{(selectedTypes.length > 0 || radiusFilter) && (
										<span className="ml-1 text-blue-600">(filtered)</span>
									)}
									{isFetching && <span className="ml-2 text-blue-600">Updating...</span>}
								</>
							)}
						</div>
					)}
				</div>

				{/* Filters */}
				{showFilters && !isCollapsed && (
					<div className="p-4 border-b border-gray-200 bg-gray-50">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-medium text-gray-700">Filters</h3>
							{(selectedTypes.length > 0 || radiusFilter) && (
								<button
									onClick={clearFilters}
									className="text-xs text-gray-600 hover:text-gray-800"
								>
									Clear all
								</button>
							)}
						</div>
						
						{/* Radius Filter */}
						<div className="mb-4">
							<div className="flex items-center gap-2 mb-2">
								<MapPin className="h-4 w-4 text-gray-600" />
								<h4 className="text-sm font-medium text-gray-700">
									{userLocation ? 'Distance from you' : 'Filter by radius'}
								</h4>
							</div>
							{!userLocation && (
								<p className="text-xs text-gray-500 mb-2">
									Enable location access to filter by distance from your current location
								</p>
							)}
							<div className="grid grid-cols-3 gap-2">
								{[5, 10, 25].map((radius) => (
								<button
									key={radius}
									onClick={() => {
										const newFilter = radiusFilter === radius ? null : radius
										console.log(`Setting radius filter to: ${newFilter}km`)
										setRadiusFilter(newFilter)
									}}
									disabled={!userLocation}
									className={cn(
										'px-3 py-2 text-xs rounded transition-colors',
										!userLocation && 'opacity-50 cursor-not-allowed',
										radiusFilter === radius
											? 'bg-blue-100 text-blue-800 border border-blue-300'
											: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
									)}
								>
									{radius} km
								</button>
								))}
							</div>
						</div>
						
						{/* Type Filter */}
						<div>
							<h4 className="text-sm font-medium text-gray-700 mb-2">Disaster Type</h4>
							<div className="grid grid-cols-2 gap-2">
								{disasterTypes.map((type) => {
									const count = getTypeCount(type)
									const isSelected = selectedTypes.includes(type)
									
									return (
										<button
											key={type}
											onClick={() => toggleTypeFilter(type)}
										className={cn(
											'flex items-center justify-between p-2 rounded text-sm transition-colors',
											isSelected
												? 'bg-gray-100 text-gray-800 border border-gray-300'
												: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
										)}
										>
											<span>{getDisasterDisplayName(type)}</span>
											<span className={cn(
												'text-xs px-1.5 py-0.5 rounded',
												isSelected ? 'bg-gray-200' : 'bg-gray-100'
											)}>
												{count}
											</span>
										</button>
									)
								})}
							</div>
						</div>
					</div>
				)}

				{/* Reports List */}
				{!isCollapsed && (
					<div className="flex-1 overflow-y-auto">
					{error ? (
						<div className="p-4 text-center">
							<div className="text-red-600 text-sm mb-2">Failed to load reports</div>
							<Button size="sm" onClick={() => refetch()}>
								Try Again
							</Button>
						</div>
					) : isLoading ? (
						<div className="p-4 space-y-3">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="animate-pulse">
									<div className="bg-gray-200 rounded-lg p-4">
										<div className="h-4 bg-gray-300 rounded mb-2"></div>
										<div className="h-3 bg-gray-300 rounded w-3/4"></div>
									</div>
								</div>
							))}
						</div>
					) : filteredReports.length === 0 ? (
						<div className="p-4 text-center text-gray-500">
							{selectedTypes.length > 0 ? (
								<>
									<div className="text-sm mb-2">No reports match your filters</div>
									<button
										onClick={clearFilters}
										className="text-xs text-blue-600 hover:text-blue-800"
									>
										Clear filters
									</button>
								</>
							) : (
								<div className="text-sm">No reports available</div>
							)}
						</div>
					) : (
						<div className="p-4 space-y-3">
							{filteredReports.map((report: any) => (
								<DisasterCard
									key={report.id}
									report={report}
									userLocation={userLocation}
									onClick={() => handleReportClick(report)}
								/>
							))}
						</div>
					)}
					</div>
				)}
			</div>

			{/* Mobile Sidebar Overlay */}
			{isOpen && (
				<div className="md:hidden fixed inset-0 z-[9998] bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
			)}

			{/* Mobile Sidebar */}
			<div className={cn(
				'md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[9999]',
				isOpen ? 'translate-x-0' : 'translate-x-full'
			)}>
				{/* Mobile Header */}
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-lg font-semibold text-gray-900">Live Feed</h2>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowFilters(!showFilters)}
								className={cn(
									'h-8 w-8 p-0',
									showFilters && 'bg-gray-100'
								)}
							>
								<Filter className="h-4 w-4" />
							</Button>
							
							<Button
								variant="ghost"
								size="sm"
								onClick={() => refetch()}
								loading={isFetching}
								className="h-8 w-8 p-0"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
							
							<button
								onClick={() => setIsOpen(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Mobile Stats */}
					<div className="text-sm text-gray-600">
						{isLoading ? (
							'Loading reports...'
						) : (
							<>
								{filteredReports.length} of {reports.length} reports
								{(selectedTypes.length > 0 || radiusFilter) && (
									<span className="ml-1 text-blue-600">(filtered)</span>
								)}
								{isFetching && <span className="ml-2 text-blue-600">Updating...</span>}
							</>
						)}
					</div>
				</div>

				{/* Mobile Filters */}
				{showFilters && (
					<div className="p-4 border-b border-gray-200 bg-gray-50">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-medium text-gray-700">Filters</h3>
							{(selectedTypes.length > 0 || radiusFilter) && (
								<button
									onClick={clearFilters}
									className="text-xs text-gray-600 hover:text-gray-800"
								>
									Clear all
								</button>
							)}
						</div>
						
						{/* Radius Filter */}
						<div className="mb-4">
							<div className="flex items-center gap-2 mb-2">
								<MapPin className="h-4 w-4 text-gray-600" />
								<h4 className="text-sm font-medium text-gray-700">
									{userLocation ? 'Distance from you' : 'Filter by radius'}
								</h4>
							</div>
							{!userLocation && (
								<p className="text-xs text-gray-500 mb-2">
									Enable location access to filter by distance from your current location
								</p>
							)}
							<div className="grid grid-cols-3 gap-2">
								{[5, 10, 25].map((radius) => (
								<button
									key={radius}
									onClick={() => {
										const newFilter = radiusFilter === radius ? null : radius
										console.log(`Setting radius filter to: ${newFilter}km`)
										setRadiusFilter(newFilter)
									}}
									disabled={!userLocation}
									className={cn(
										'px-3 py-2 text-xs rounded transition-colors',
										!userLocation && 'opacity-50 cursor-not-allowed',
										radiusFilter === radius
											? 'bg-blue-100 text-blue-800 border border-blue-300'
											: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
									)}
								>
									{radius} km
								</button>
								))}
							</div>
						</div>
						
						{/* Type Filter */}
						<div>
							<h4 className="text-sm font-medium text-gray-700 mb-2">Disaster Type</h4>
							<div className="grid grid-cols-2 gap-2">
								{disasterTypes.map((type) => {
									const count = getTypeCount(type)
									const isSelected = selectedTypes.includes(type)
									
									return (
										<button
											key={type}
											onClick={() => toggleTypeFilter(type)}
										className={cn(
											'flex items-center justify-between p-2 rounded text-sm transition-colors',
											isSelected
												? 'bg-gray-100 text-gray-800 border border-gray-300'
												: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
										)}
										>
											<span>{getDisasterDisplayName(type)}</span>
											<span className={cn(
												'text-xs px-1.5 py-0.5 rounded',
												isSelected ? 'bg-gray-200' : 'bg-gray-100'
											)}>
												{count}
											</span>
										</button>
									)
								})}
							</div>
						</div>
					</div>
				)}

				{/* Mobile Reports List */}
				<div className="flex-1 overflow-y-auto">
					{error ? (
						<div className="p-4 text-center">
							<div className="text-red-600 text-sm mb-2">Failed to load reports</div>
							<Button size="sm" onClick={() => refetch()}>
								Try Again
							</Button>
						</div>
					) : isLoading ? (
						<div className="p-4 space-y-3">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="animate-pulse">
									<div className="bg-gray-200 rounded-lg p-4">
										<div className="h-4 bg-gray-300 rounded mb-2"></div>
										<div className="h-3 bg-gray-300 rounded w-3/4"></div>
									</div>
								</div>
							))}
						</div>
					) : filteredReports.length === 0 ? (
						<div className="p-4 text-center text-gray-500">
							<div className="text-sm">No reports available</div>
						</div>
					) : (
						<div className="p-4 space-y-3">
							{filteredReports.map((report: any) => (
								<DisasterCard
									key={report.id}
									report={report}
									userLocation={userLocation}
									onClick={() => handleReportClick(report)}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
