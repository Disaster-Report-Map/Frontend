import { useMemo } from 'react'
import type { Coordinates } from '../../types'

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
	const R = 6371 // Earth's radius in kilometers
	const dLat = toRadians(coord2.lat - coord1.lat)
	const dLng = toRadians(coord2.lng - coord1.lng)
	
	const a = 
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
		Math.sin(dLng / 2) * Math.sin(dLng / 2)
	
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distance = R * c
	
	return distance
}

const toRadians = (degrees: number): number => {
	return degrees * (Math.PI / 180)
}

/**
 * Hook to calculate distance between user location and disaster reports
 */
export const useDistance = (
	userLocation: Coordinates | null,
	reports: Array<{ location: Coordinates; [key: string]: any }>
) => {
	return useMemo(() => {
		if (!userLocation) {
			return reports.map(report => ({ ...report, distance: null }))
		}

		return reports.map(report => ({
			...report,
			distance: calculateDistance(userLocation, report.location),
		}))
	}, [userLocation, reports])
}

/**
 * Hook to find nearby reports within a specified radius
 */
export const useNearbyReports = (
	userLocation: Coordinates | null,
	reports: Array<{ location: Coordinates; [key: string]: any }>,
	radiusKm: number = 5
) => {
	const reportsWithDistance = useDistance(userLocation, reports)

	return useMemo(() => {
		if (!userLocation) return []

		return reportsWithDistance
			.filter(report => report.distance !== null && report.distance <= radiusKm)
			.sort((a, b) => (a.distance || 0) - (b.distance || 0))
	}, [reportsWithDistance, radiusKm, userLocation])
}

/**
 * Format distance for display
 */
export const formatDistance = (distance: number | null): string => {
	if (distance === null) return 'Unknown'
	
	if (distance < 1) {
		return `${Math.round(distance * 1000)}m`
	}
	
	return `${distance.toFixed(1)}km`
}
