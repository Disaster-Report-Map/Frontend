import { useState, useEffect, useCallback, useRef } from 'react'
import type { UserLocation } from '../../types'

interface GeolocationOptions {
	enableHighAccuracy?: boolean
	timeout?: number
	maximumAge?: number
}

interface GeolocationState {
	location: UserLocation | null
	error: string | null
	loading: boolean
	permission: 'granted' | 'denied' | 'prompt' | 'unknown'
}

const defaultOptions: GeolocationOptions = {
	enableHighAccuracy: true,
	timeout: 15000, // Increased to 15 seconds
	maximumAge: 300000, // 5 minutes
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
	const [state, setState] = useState<GeolocationState>({
		location: null,
		error: null,
		loading: false,
		permission: 'unknown',
	})

	const isRequestingRef = useRef(false)
	const hasRequestedRef = useRef(false)
	const retryAttemptedRef = useRef(false)
	const mergedOptions = { ...defaultOptions, ...options }

	const checkPermission = useCallback(async () => {
		if (!navigator.permissions) {
			setState(prev => ({ ...prev, permission: 'unknown' }))
			return
		}

		try {
			const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
			setState(prev => ({ ...prev, permission: permission.state as 'granted' | 'denied' | 'prompt' }))
		} catch (error) {
			setState(prev => ({ ...prev, permission: 'unknown' }))
		}
	}, [])

	const getCurrentPosition = useCallback(() => {
		if (!navigator.geolocation) {
			setState(prev => ({
				...prev,
				error: 'Geolocation is not supported by this browser',
				loading: false,
			}))
			return
		}

		// Prevent multiple simultaneous calls using ref
		if (isRequestingRef.current) {
			return
		}

		isRequestingRef.current = true
		setState(prev => ({ ...prev, loading: true, error: null }))

		// Add a manual timeout fallback in case browser timeout doesn't work
		const timeoutId = setTimeout(() => {
			if (isRequestingRef.current) {
				isRequestingRef.current = false
				setState(prev => ({
					...prev,
					loading: false,
					error: 'Location request timed out'
				}))
			}
		}, 15000) // 15 seconds manual timeout

		navigator.geolocation.getCurrentPosition(
			(position) => {
				clearTimeout(timeoutId)
				isRequestingRef.current = false
				const location: UserLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					accuracy: position.coords.accuracy,
					timestamp: Date.now(),
				}

				setState(prev => ({
					...prev,
					location,
					loading: false,
					error: null,
					permission: 'granted',
				}))
			},
			(error) => {
				clearTimeout(timeoutId)
				isRequestingRef.current = false
				let errorMessage = 'Failed to get location'
				
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage = 'Location access denied by user'
						setState(prev => ({ ...prev, permission: 'denied' }))
						break
					case error.POSITION_UNAVAILABLE:
						errorMessage = 'Location information is unavailable. Please check your device location settings.'
						// Don't retry for this error - it usually means GPS is off or unavailable
						hasRequestedRef.current = true // Mark as attempted to prevent retries
						retryAttemptedRef.current = true // Prevent further retries
						break
					case error.TIMEOUT:
						errorMessage = 'Location request timed out'
						// Don't set permission to denied for this error
						break
					default:
						errorMessage = 'An unknown error occurred'
						break
				}

				setState(prev => ({
					...prev,
					error: errorMessage,
					loading: false,
				}))
			},
			mergedOptions
		)
	}, [mergedOptions])

	const watchPosition = useCallback(() => {
		if (!navigator.geolocation) {
			setState(prev => ({
				...prev,
				error: 'Geolocation is not supported by this browser',
				loading: false,
			}))
			return () => {}
		}

		setState(prev => ({ ...prev, loading: true, error: null }))

		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				const location: UserLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					accuracy: position.coords.accuracy,
					timestamp: Date.now(),
				}

				setState(prev => ({
					...prev,
					location,
					loading: false,
					error: null,
					permission: 'granted',
				}))
			},
			(error) => {
				let errorMessage = 'Failed to watch location'
				
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage = 'Location access denied by user'
						setState(prev => ({ ...prev, permission: 'denied' }))
						break
					case error.POSITION_UNAVAILABLE:
						errorMessage = 'Location information is unavailable'
						break
					case error.TIMEOUT:
						errorMessage = 'Location request timed out'
						break
					default:
						errorMessage = 'An unknown error occurred'
						break
				}

				setState(prev => ({
					...prev,
					error: errorMessage,
					loading: false,
				}))
			},
			mergedOptions
		)

		return () => navigator.geolocation.clearWatch(watchId)
	}, [mergedOptions])

	useEffect(() => {
		checkPermission()
		
		// Listen for permission changes
		if (navigator.permissions) {
			let permissionStatus: PermissionStatus | null = null
			
			navigator.permissions.query({ name: 'geolocation' as PermissionName })
				.then((status) => {
					permissionStatus = status
					const currentState = status.state as 'granted' | 'denied' | 'prompt'
					setState(prev => ({ ...prev, permission: currentState }))
					
					// If permission is already granted, clear errors
					if (currentState === 'granted') {
						setState(prev => ({ ...prev, error: null }))
					}
					
					// Listen for permission changes
					status.onchange = () => {
						const newState = status.state as 'granted' | 'denied' | 'prompt'
						setState(prev => ({ ...prev, permission: newState }))
						// Clear errors when permission is granted - let useEffect handle retry
						if (newState === 'granted') {
							setState(prev => ({ ...prev, error: null }))
							// Reset retry flag to allow one retry attempt
							retryAttemptedRef.current = false
						}
					}
				})
				.catch(() => {
					// Permission API not supported or failed
				})
			
			return () => {
				if (permissionStatus) {
					permissionStatus.onchange = null
				}
			}
		}
	}, [checkPermission, getCurrentPosition])

	// Watch for permission state changes and retry when granted
	
	useEffect(() => {
		// Only request location once on mount if permission is already granted
		if (state.permission === 'granted' && !state.location && !state.loading && !hasRequestedRef.current) {
			hasRequestedRef.current = true
			setState(prev => ({ ...prev, error: null }))
			const timer = setTimeout(() => {
				getCurrentPosition()
			}, 300)
			return () => clearTimeout(timer)
		}
		
		// Retry once when permission changes from prompt/denied to granted
		if (state.permission === 'granted' && !state.location && !state.loading && !retryAttemptedRef.current && hasRequestedRef.current) {
			retryAttemptedRef.current = true
			setState(prev => ({ ...prev, error: null }))
			const timer = setTimeout(() => {
				getCurrentPosition()
			}, 500)
			return () => clearTimeout(timer)
		}
		
		// Reset retry flag when we get a location
		if (state.location) {
			retryAttemptedRef.current = false
		}
	}, [state.permission, state.location, state.loading, getCurrentPosition])

	return {
		...state,
		getCurrentPosition,
		watchPosition,
		checkPermission,
	}
}
