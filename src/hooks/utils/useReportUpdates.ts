import { useState, useEffect, useRef } from 'react'
import type { DisasterReport } from '../../types'

interface ReportUpdate {
	reportId: string
	previousStatus?: string
	newStatus: string
	timestamp: string
}

/**
 * Hook to track report status updates and detect changes
 */
export const useReportUpdates = (reports: DisasterReport[]) => {
	const [updates, setUpdates] = useState<ReportUpdate[]>([])
	const previousReportsRef = useRef<Map<string, DisasterReport>>(new Map())

	useEffect(() => {
		const currentReportsMap = new Map<string, DisasterReport>()
		
		// Build current reports map
		reports.forEach(report => {
			currentReportsMap.set(report.id, report)
		})

		// Check for status changes
		const newUpdates: ReportUpdate[] = []
		
		reports.forEach(report => {
			const previousReport = previousReportsRef.current.get(report.id)
			
			// If this is a new report, skip (handled by new report alerts)
			if (!previousReport) {
				return
			}
			
			// Check if status changed
			if (previousReport.status !== report.status) {
				newUpdates.push({
					reportId: report.id,
					previousStatus: previousReport.status,
					newStatus: report.status,
					timestamp: report.timestamp
				})
			}
		})

		// Add new updates
		if (newUpdates.length > 0) {
			setUpdates(prev => [...prev, ...newUpdates])
		}

		// Update the ref for next comparison
		previousReportsRef.current = currentReportsMap
	}, [reports])

	// Clear updates after a certain time to prevent memory buildup
	useEffect(() => {
		const interval = setInterval(() => {
			setUpdates(prev => {
				const now = Date.now()
				const fiveMinutesAgo = now - (5 * 60 * 1000)
				
				return prev.filter(update => {
					const updateTime = new Date(update.timestamp).getTime()
					return updateTime > fiveMinutesAgo
				})
			})
		}, 60000) // Check every minute

		return () => clearInterval(interval)
	}, [])

	return updates
}
