import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, X, MapPin, CheckCircle, Clock } from 'lucide-react'
import { getDisasterEmoji, getDisasterDisplayName, formatDistance } from '../../utils'
import { useNearbyReports } from '../../hooks/utils/useDistance'
import { useReportUpdates } from '../../hooks/utils/useReportUpdates'
import type { DisasterReport, UserLocation } from '../../types'
import { cn } from '../../utils/cn'

interface AlertBannerProps {
	userLocation: UserLocation | null
	reports: DisasterReport[]
	onDismiss?: (reportId: string) => void
	className?: string
}

interface AlertState {
	id: string
	report?: DisasterReport
	distance?: number
	dismissed: boolean
	type: 'new_report' | 'status_update' | 'success' | 'error' | 'info'
	previousStatus?: string
	message?: string
	title?: string
}

// Global function to show alerts
let showAlertFunction: ((alert: Omit<AlertState, 'id' | 'dismissed'>) => void) | null = null

export const showAlert = (alert: Omit<AlertState, 'id' | 'dismissed'>) => {
	if (showAlertFunction) {
		showAlertFunction(alert)
	}
}

export const AlertBanner = ({ userLocation, reports, onDismiss, className }: AlertBannerProps) => {
	const [alerts, setAlerts] = useState<AlertState[]>([])
	const [seenReportIds, setSeenReportIds] = useState<Set<string>>(new Set())
	const [seenUpdateIds, setSeenUpdateIds] = useState<Set<string>>(new Set())
	const nearbyReports = useNearbyReports(userLocation, reports, 5) // 5km radius
	const reportUpdates = useReportUpdates(reports)

	const dismissAlert = useCallback((alertId: string) => {
		// First mark as dismissed for fade-out animation
		setAlerts(prev => 
			prev.map(alert => 
				alert.id === alertId 
					? { ...alert, dismissed: true }
					: alert
			)
		)
		
		// Remove from array after animation (300ms)
		setTimeout(() => {
			setAlerts(prev => prev.filter(alert => alert.id !== alertId))
		}, 300)
		
		onDismiss?.(alertId)
	}, [onDismiss])

	// Set up global alert function
	useEffect(() => {
		showAlertFunction = (alert: Omit<AlertState, 'id' | 'dismissed'>) => {
			const newAlert: AlertState = {
				...alert,
				id: `custom-${Date.now()}-${Math.random()}`,
				dismissed: false
			}
			setAlerts(prev => [...prev, newAlert])
			
			// Auto-dismiss after 5 seconds
			const timeoutId = setTimeout(() => {
				dismissAlert(newAlert.id)
			}, 5000)
			
			// Store timeout ID for cleanup if needed
			return () => clearTimeout(timeoutId)
		}
		
		return () => {
			showAlertFunction = null
		}
	}, [dismissAlert])

	// Handle new reports
	useEffect(() => {
		if (!userLocation || nearbyReports.length === 0) {
			return
		}

		// Only show alerts for NEW reports that haven't been seen before
		const newReports = nearbyReports.filter((report: any) => {
			const reportId = report.id || report.report?.id
			return reportId && !seenReportIds.has(reportId)
		})

		if (newReports.length > 0) {
			// Create alerts only for new reports
			const newAlerts: AlertState[] = newReports.map((report: any, index: number) => {
				const { distance, ...reportData } = report
				const reportId = reportData.id || `new-${index}`
				
				// Mark this report as seen
				setSeenReportIds(prev => new Set([...prev, reportId]))
				
				return {
					id: `alert-${reportId}`,
					report: reportData as DisasterReport,
					distance: distance || 0,
					dismissed: false,
					type: 'new_report'
				}
			})

			// Add new alerts (only show the most recent one)
			if (newAlerts.length > 0) {
				const latestAlert = newAlerts[newAlerts.length - 1] // Get the most recent
				setAlerts(prev => [...prev, latestAlert])
				
				// Auto-dismiss after 5 seconds
				const timeoutId = setTimeout(() => {
					dismissAlert(latestAlert.id)
				}, 5000)
				
				// Cleanup timeout on unmount
				return () => clearTimeout(timeoutId)
			}
		}
	}, [userLocation, nearbyReports, seenReportIds, dismissAlert])

	// Handle status updates
	useEffect(() => {
		if (reportUpdates.length === 0) {
			return
		}

		// Filter for nearby reports with status updates
		const nearbyUpdates = reportUpdates.filter(update => {
			const report = reports.find(r => r.id === update.reportId)
			if (!report || !userLocation) return false
			
			// Check if report is within 5km
			const distance = Math.sqrt(
				Math.pow(report.location.lat - userLocation.lat, 2) +
				Math.pow(report.location.lng - userLocation.lng, 2)
			) * 111 // Rough conversion to km
			
			return distance <= 5 && !seenUpdateIds.has(update.reportId)
		})

		if (nearbyUpdates.length > 0) {
			const latestUpdate = nearbyUpdates[nearbyUpdates.length - 1]
			const report = reports.find(r => r.id === latestUpdate.reportId)
			
			if (report) {
				// Mark this update as seen
				setSeenUpdateIds(prev => new Set([...prev, latestUpdate.reportId]))
				
				const distance = userLocation ? Math.sqrt(
					Math.pow(report.location.lat - userLocation.lat, 2) +
					Math.pow(report.location.lng - userLocation.lng, 2)
				) * 111 : 0
				
				const statusUpdateAlert: AlertState = {
					id: `status-update-${latestUpdate.reportId}`,
					report: report,
					distance: distance,
					dismissed: false,
					type: 'status_update',
					previousStatus: latestUpdate.previousStatus
				}
				
				setAlerts(prev => [...prev, statusUpdateAlert])
				
				// Auto-dismiss after 5 seconds
				const timeoutId = setTimeout(() => {
					dismissAlert(statusUpdateAlert.id)
				}, 5000)
				
				// Cleanup timeout on unmount
				return () => clearTimeout(timeoutId)
			}
		}
	}, [reportUpdates, reports, userLocation, seenUpdateIds, dismissAlert])

	if (alerts.length === 0) {
		return null
	}

	// Show the most recent alert (even if it's being dismissed, for fade-out animation)
	const currentAlert = alerts[alerts.length - 1]

	// Determine alert styling based on type and status
	const getAlertStyling = (alert: AlertState) => {
		// Handle custom alert types first
		if (alert.type === 'success') {
			return {
				bgColor: 'bg-green-50',
				borderColor: 'border-green-200',
				iconColor: 'text-green-600',
				titleColor: 'text-green-800',
				textColor: 'text-green-700',
				icon: CheckCircle,
				title: alert.title || 'Success'
			}
		}
		
		if (alert.type === 'error') {
			return {
				bgColor: 'bg-red-50',
				borderColor: 'border-red-200',
				iconColor: 'text-red-600',
				titleColor: 'text-red-800',
				textColor: 'text-red-700',
				icon: AlertTriangle,
				title: alert.title || 'Error'
			}
		}
		
		if (alert.type === 'info') {
			return {
				bgColor: 'bg-blue-50',
				borderColor: 'border-blue-200',
				iconColor: 'text-blue-600',
				titleColor: 'text-blue-800',
				textColor: 'text-blue-700',
				icon: Clock,
				title: alert.title || 'Information'
			}
		}
		
		// For report-related alerts, use the report's status
		if (alert.report) {
			const status = alert.type === 'new_report' ? 'active' : alert.report.status
			
			switch (status) {
				case 'resolved':
					return {
						bgColor: 'bg-green-50',
						borderColor: 'border-green-200',
						iconColor: 'text-green-600',
						titleColor: 'text-green-800',
						textColor: 'text-green-700',
						icon: CheckCircle,
						title: 'Report Resolved'
					}
				case 'investigating':
					return {
						bgColor: 'bg-yellow-50',
						borderColor: 'border-yellow-200',
						iconColor: 'text-yellow-600',
						titleColor: 'text-yellow-800',
						textColor: 'text-yellow-700',
						icon: Clock,
						title: 'Under Investigation'
					}
				case 'active':
				default:
					return {
						bgColor: 'bg-red-50',
						borderColor: 'border-red-200',
						iconColor: 'text-red-600',
						titleColor: 'text-red-800',
						textColor: 'text-red-700',
						icon: AlertTriangle,
						title: alert.type === 'new_report' 
							? `${getDisasterDisplayName(alert.report.type)} Alert`
							: 'Report Active'
					}
			}
		}
		
		// Default fallback
		return {
			bgColor: 'bg-gray-50',
			borderColor: 'border-gray-200',
			iconColor: 'text-gray-600',
			titleColor: 'text-gray-800',
			textColor: 'text-gray-700',
			icon: Clock,
			title: 'Notification'
		}
	}

	const styling = getAlertStyling(currentAlert)
	const IconComponent = styling.icon

	return (
		<div className={cn('fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[9998] max-w-sm w-full px-4', className)}>
			<div
				className={cn(
					'text-nowrap border rounded-lg p-3 shadow-lg transition-opacity duration-300',
					currentAlert.dismissed ? 'opacity-0' : 'opacity-100 animate-in slide-in-from-bottom-2 duration-500',
					styling.bgColor,
					styling.borderColor
				)}
				role="alert"
			>
				<div className="flex items-center gap-2">
					<div className="flex-shrink-0">
						<IconComponent className={cn('h-4 w-4', styling.iconColor)} />
					</div>
					
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							{currentAlert.report && (
								<span className="text-sm">{getDisasterEmoji(currentAlert.report.type)}</span>
							)}
							<h3 className={cn('text-xs font-semibold', styling.titleColor)}>
								{styling.title}
							</h3>
						</div>
						
						<p className={cn('text-xs mb-1 line-clamp-2', styling.textColor)}>
							{currentAlert.message || (
								currentAlert.type === 'new_report' 
									? currentAlert.report?.description
									: currentAlert.report 
										? `${getDisasterDisplayName(currentAlert.report.type)} report status changed${
											currentAlert.previousStatus 
												? ` from ${currentAlert.previousStatus} to ${currentAlert.report.status}`
												: ` to ${currentAlert.report.status}`
										}`
										: 'Notification'
							)}
						</p>
						
						{currentAlert.distance !== undefined && (
							<div className="flex items-center gap-2 text-xs">
								<div className={cn('flex items-center gap-1', styling.textColor)}>
									<MapPin className="h-3 w-3" />
									<span>{formatDistance(currentAlert.distance)} away</span>
								</div>
							</div>
						)}
					</div>
					
					<button
						onClick={() => dismissAlert(currentAlert.id)}
						className={cn('flex-shrink-0 transition-colors', styling.textColor, 'hover:opacity-70')}
						aria-label="Dismiss alert"
					>
						<X className="h-3 w-3" />
					</button>
				</div>
			</div>
		</div>
	)
}
