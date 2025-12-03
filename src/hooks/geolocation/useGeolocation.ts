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
			console.log('getCurrentPosition already in progress, skipping...')
			return
		}

		isRequestingRef.current = true
		setState(prev => ({ ...prev, loading: true, error: null }))

		console.log('Calling navigator.geolocation.getCurrentPosition...')

		// Add a manual timeout fallback in case browser timeout doesn't work
		const timeoutId = setTimeout(() => {
			console.warn('Manual timeout: getCurrentPosition took too long, clearing loading state')
			isRequestingRef.current = false
			setState(prev => ({
				...prev,
				loading: false,
				error: 'Location request timed out (manual timeout)'
			}))
		}, 15000) // 15 seconds manual timeout

		navigator.geolocation.getCurrentPosition(
			(position) => {
				clearTimeout(timeoutId)
				isRequestingRef.current = false
				console.log('getCurrentPosition success:', position.coords)
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
				console.log('getCurrentPosition error:', error.code, error.message)
				let errorMessage = 'Failed to get location'
				
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage = 'Location access denied by user'
						setState(prev => ({ ...prev, permission: 'denied' }))
						break
					case error.POSITION_UNAVAILABLE:
						errorMessage = 'Location information is unavailable'
						// Don't set permission to denied for this error
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
						// If permission is granted, clear any errors and retry
						if (newState === 'granted') {
							setState(prev => ({ ...prev, error: null }))
							// Small delay to ensure permission is fully applied
							setTimeout(() => {
								getCurrentPosition()
							}, 100)
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
	// Use a ref to track if we've already attempted to get location for this permission state
	const retryAttemptedRef = useRef(false)
	
	useEffect(() => {
		if (state.permission === 'granted' && !state.location && !state.loading) {
			// Only retry once per permission grant cycle
			if (!retryAttemptedRef.current) {
				retryAttemptedRef.current = true
				// Clear any previous errors and retry
				setState(prev => ({ ...prev, error: null }))
				// Small delay to ensure state is updated
				const timer = setTimeout(() => {
					console.log('Permission granted in hook, attempting to get location...')
					getCurrentPosition()
				}, 500)
				return () => clearTimeout(timer)
			}
		} else if (state.location) {
			// Reset the ref when we successfully get a location
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
