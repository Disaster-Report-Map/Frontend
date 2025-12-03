import type { DisasterType } from '../types'

/**
 * Get disaster type emoji
 */
export const getDisasterEmoji = (type: DisasterType): string => {
	const emojis = {
		flood: '🌊',
		fire: '🔥',
		accident: '🚑',
		collapse: '🏚️',
	}
	return emojis[type]
}

/**
 * Get disaster type display name
 */
export const getDisasterDisplayName = (type: DisasterType): string => {
	const names = {
		flood: 'Flood',
		fire: 'Fire',
		accident: 'Accident',
		collapse: 'Building Collapse',
	}
	return names[type]
}

/**
 * Get disaster type color for UI
 */
export const getDisasterColor = (type: DisasterType): string => {
	const colors = {
		flood: 'text-blue-600 bg-blue-100',
		fire: 'text-red-600 bg-red-100',
		accident: 'text-yellow-600 bg-yellow-100',
		collapse: 'text-gray-600 bg-gray-100',
	}
	return colors[type]
}

/**
 * Get status color for UI
 */
export const getStatusColor = (status: 'active' | 'resolved' | 'investigating'): string => {
	const colors = {
		active: 'text-red-600 bg-red-100',
		resolved: 'text-green-600 bg-green-100',
		investigating: 'text-yellow-600 bg-yellow-100',
	}
	return colors[status]
}

/**
 * Format timestamp for display (converts UTC to user's local timezone)
 */
export const formatTimestamp = (timestamp: string): string => {
	// Handle various timestamp formats and normalize them
	let normalizedTimestamp = timestamp
	
	// Handle microseconds (more than 3 digits after decimal point)
	if (normalizedTimestamp.includes('.') && normalizedTimestamp.split('.')[1].length > 3) {
		// Find the decimal point and the timezone indicator
		const decimalIndex = normalizedTimestamp.indexOf('.')
		const timezoneIndex = normalizedTimestamp.search(/[+-]|Z/)
		
		if (timezoneIndex > decimalIndex) {
			// Extract parts: seconds, microseconds, timezone
			const seconds = normalizedTimestamp.substring(0, decimalIndex)
			const microseconds = normalizedTimestamp.substring(decimalIndex + 1, timezoneIndex)
			const timezone = normalizedTimestamp.substring(timezoneIndex)
			
			// Truncate microseconds to milliseconds (3 digits)
			const milliseconds = microseconds.substring(0, 3)
			
			// Reconstruct the timestamp
			normalizedTimestamp = `${seconds}.${milliseconds}${timezone}`
		} else {
			// No timezone, just truncate microseconds
			const parts = normalizedTimestamp.split('.')
			const seconds = parts[0]
			const microseconds = parts[1]
			const milliseconds = microseconds.substring(0, 3)
			normalizedTimestamp = `${seconds}.${milliseconds}`
		}
	}
	
	// IMPORTANT: If timestamp has no timezone info, assume it's UTC and add 'Z'
	if (!normalizedTimestamp.includes('Z') && !normalizedTimestamp.includes('+') && !normalizedTimestamp.includes('-', 10)) {
		normalizedTimestamp += 'Z'
	}
	
	// Create Date object from the timestamp (handles UTC conversion automatically)
	const date = new Date(normalizedTimestamp)
	const now = new Date()
	
	// Check if date is valid
	if (isNaN(date.getTime())) {
		console.warn('Invalid timestamp:', timestamp, 'normalized:', normalizedTimestamp)
		return 'Unknown time'
	}
	
	// Debug logging for timestamp issues
	if (import.meta.env.DEV) {
		console.log('Timestamp debug:', {
			original: timestamp,
			normalized: normalizedTimestamp,
			utcDate: date.toISOString(),
			localDate: date.toString(),
			now: now.toISOString(),
			nowLocal: now.toString(),
			userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
		})
	}
	
	// Calculate difference in milliseconds (both dates are in local timezone)
	const diffMs = now.getTime() - date.getTime()
	const diffMins = Math.floor(diffMs / (1000 * 60))
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

	if (diffMins < 1) {
		return 'Just now'
	} else if (diffMins < 60) {
		return `${diffMins}m ago`
	} else if (diffHours < 24) {
		return `${diffHours}h ago`
	} else if (diffDays < 7) {
		return `${diffDays}d ago`
	} else {
		// Use local date formatting
		return date.toLocaleDateString()
	}
}

/**
 * Format timestamp for detailed display (converts UTC to user's local timezone)
 */
export const formatDetailedTimestamp = (timestamp: string): string => {
	// Ensure timestamp is treated as UTC if no timezone info
	let normalizedTimestamp = timestamp
	if (!normalizedTimestamp.includes('Z') && !normalizedTimestamp.includes('+') && !normalizedTimestamp.includes('-', 10)) {
		normalizedTimestamp += 'Z'
	}
	
	const date = new Date(normalizedTimestamp)
	return date.toLocaleString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZoneName: 'short', // Shows timezone abbreviation (e.g., EST, PST)
	})
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: ReturnType<typeof setTimeout> | null = null
	
	return (...args: Parameters<T>) => {
		if (timeout) {
			clearTimeout(timeout)
		}
		
		timeout = setTimeout(() => {
			func(...args)
		}, wait)
	}
}

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
	func: T,
	limit: number
): ((...args: Parameters<T>) => void) => {
	let inThrottle: boolean
	
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args)
			inThrottle = true
			setTimeout(() => (inThrottle = false), limit)
		}
	}
}

/**
 * Generate a random ID
 */
export const generateId = (): string => {
	return Math.random().toString(36).substr(2, 9)
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

/**
 * Validate coordinates
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
	return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max)
}

/**
 * Convert file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes'
	
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if a file is a valid image
 */
export const isValidImageFile = (file: File): boolean => {
	const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
	const maxSize = 5 * 1024 * 1024 // 5MB
	
	return validTypes.includes(file.type) && file.size <= maxSize
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
