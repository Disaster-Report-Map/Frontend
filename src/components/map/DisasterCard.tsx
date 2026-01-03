import { MapPin, Clock, Eye, ChevronDown, Navigation } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'
import { getDisasterEmoji, getDisasterDisplayName, getStatusColor, formatDistance } from '../../utils'
import { useReporterId, useUpdateReportStatus } from '../../hooks/api/useReports'
import { useRealTimeTimestamp } from '../../hooks/utils/useRealTimeTimestamp'
import type { DisasterReport } from '../../types'
import { showAlert } from '../layout/AlertBanner'

interface DisasterCardProps {
	report: DisasterReport
	userLocation?: { lat: number; lng: number } | null
	onClick?: () => void
	className?: string
}

export const DisasterCard = ({ report, userLocation, onClick, className }: DisasterCardProps) => {
	const [showStatusDropdown, setShowStatusDropdown] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { data: reporterData } = useReporterId()
	const updateStatusMutation = useUpdateReportStatus()
	
	const currentReporterId = reporterData?.reporter_id
	const isOwner = currentReporterId && report.reporterId === currentReporterId
	
	// Real-time timestamp that updates every minute
	const formattedTimestamp = useRealTimeTimestamp(report.timestamp)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowStatusDropdown(false)
			}
		}

		if (showStatusDropdown) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showStatusDropdown])
	
	const distance = userLocation ? 
		Math.sqrt(
			Math.pow(report.location.lat - userLocation.lat, 2) +
			Math.pow(report.location.lng - userLocation.lng, 2)
		) * 111 // Rough conversion to km
		: null

	const handleStatusUpdate = async (newStatus: 'active' | 'resolved' | 'investigating') => {
		if (!currentReporterId) return
		
		try {
			await updateStatusMutation.mutateAsync({
				reportId: report.id,
				status: newStatus,
				reporterId: currentReporterId
			})
			setShowStatusDropdown(false)
			
			// Show success toast with appropriate color and message
			const statusMessages = {
				active: 'Report marked as active',
				resolved: 'Report resolved successfully! 🎉',
				investigating: 'Report marked as under investigation'
			}
			
		
			
			// Show status update alert
			showAlert({
				type: 'success',
				title: 'Status Updated',
				message: statusMessages[newStatus]
			})
		} catch (error) {
			console.error('Failed to update status:', error)
			showAlert({
				type: 'error',
				title: 'Update Failed',
				message: 'Failed to update status. Please try again.'
			})
		}
	}

	const handleOpenInGoogleMaps = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent card click
		
		// Open Google Maps to the report coordinates
		const googleMapsUrl = `https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`
		window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')
	}

	const statusOptions = [
		{ value: 'active', label: 'Active', color: 'bg-yellow-100 text-yellow-800' },
		{ value: 'investigating', label: 'Investigating', color: 'bg-blue-100 text-blue-800' },
		{ value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' }
	]

	return (
		<div
			onClick={onClick}
			className={cn(
				'bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow',
				className
			)}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-2">
					<span className="text-lg">{getDisasterEmoji(report.type)}</span>
					<div>
						<h3 className="font-semibold text-gray-900 text-sm">
							{getDisasterDisplayName(report.type)}
						</h3>
						{isOwner ? (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={(e) => {
										e.stopPropagation()
										setShowStatusDropdown(!showStatusDropdown)
									}}
									className={cn(
										'text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:opacity-80 transition-opacity',
										getStatusColor(report.status)
									)}
									disabled={updateStatusMutation.isPending}
								>
									{report.status}
									<ChevronDown className="h-3 w-3" />
								</button>
								
								{showStatusDropdown && (
									<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
										{statusOptions.map((option) => (
											<button
												key={option.value}
												onClick={(e) => {
													e.stopPropagation()
													handleStatusUpdate(option.value as any)
												}}
												className={cn(
													'w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-md last:rounded-b-md',
													option.value === report.status && 'bg-gray-100'
												)}
											>
												{option.label}
											</button>
										))}
									</div>
								)}
							</div>
						) : (
							<span className={cn('text-xs px-2 py-1 rounded-full', getStatusColor(report.status))}>
								{report.status}
							</span>
						)}
					</div>
				</div>
				
				{onClick && (
					<Eye className="h-4 w-4 text-gray-400" />
				)}
			</div>

			{/* Description */}
			<p className="text-sm text-gray-700 mb-3 line-clamp-2">
				{report.description}
			</p>

			{/* Image */}
			{report.imageUrl && (
				<div className="mb-3">
					<img
						src={report.imageUrl}
						alt="Disaster report"
						className="w-full h-20 object-cover rounded"
					/>
				</div>
			)}

			{/* Footer */}
			<div className="flex items-center justify-between text-xs text-gray-500">
				<div className="flex items-center gap-1">
					<Clock className="h-3 w-3" />
					<span>{formattedTimestamp}</span>
				</div>
				
				<div className="flex items-center gap-3">
					{userLocation && distance !== null && (
						<div className="flex items-center gap-1">
							<MapPin className="h-3 w-3" />
							<span>{formatDistance(distance)}</span>
						</div>
					)}
					
					{/* Navigation icon - always visible to open Google Maps to coordinates */}
					<button
						onClick={handleOpenInGoogleMaps}
						className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
						title="Open location in Google Maps"
					>
						<Navigation className="h-3 w-3" />
						<span className="text-xs font-medium">Navigate</span>
					</button>
				</div>
			</div>
		</div>
	)
}
