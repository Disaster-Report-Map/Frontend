import { useEffect, useRef } from 'react'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Style, Icon } from 'ol/style'
import Overlay from 'ol/Overlay'
import 'ol/ol.css'
import type { DisasterReport, Coordinates } from '../../types'
import { getDisasterEmoji, getDisasterDisplayName, getStatusColor } from '../../utils'
import { cn } from '../../utils/cn'

interface DisasterMapProps {
	reports: DisasterReport[]
	userLocation: Coordinates | null
	onMapClick?: (coordinates: Coordinates) => void
	selectedReport?: DisasterReport | null
	center?: Coordinates
	zoom?: number
	className?: string
}

// Create custom icon style for disaster markers
const createDisasterIconStyle = (type: DisasterReport['type']) => {
	const emoji = getDisasterEmoji(type)
	const svgString = `
		<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
			<circle cx="16" cy="16" r="14" fill="white" stroke="#374151" stroke-width="2"/>
			<text x="16" y="20" text-anchor="middle" font-size="16" font-family="Arial, sans-serif">${emoji}</text>
		</svg>
	`
	
	const iconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
	
	return new Style({
		image: new Icon({
			src: iconUrl,
			scale: 1,
			anchor: [0.5, 1],
			anchorXUnits: 'fraction',
			anchorYUnits: 'fraction',
		}),
	})
}

// Create user location icon style
const createUserLocationStyle = () => {
	const svgString = `
		<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
			<circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" stroke-width="3"/>
			<circle cx="16" cy="16" r="6" fill="white"/>
			<circle cx="16" cy="16" r="2" fill="#3B82F6"/>
		</svg>
	`
	
	const iconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
	
	return new Style({
		image: new Icon({
			src: iconUrl,
			scale: 1,
			anchor: [0.5, 0.5],
			anchorXUnits: 'fraction',
			anchorYUnits: 'fraction',
		}),
	})
}

export const DisasterMap = ({ 
	reports, 
	userLocation, 
	onMapClick, 
	selectedReport,
	center,
	zoom = 13,
	className 
}: DisasterMapProps) => {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<Map | null>(null)
	const popupRef = useRef<HTMLDivElement>(null)
	const popupOverlayRef = useRef<Overlay | null>(null)
	const markersSourceRef = useRef<VectorSource | null>(null)
	const userLocationSourceRef = useRef<VectorSource | null>(null)
	const previousCenterRef = useRef<Coordinates | null>(null)

	// Initialize map
	useEffect(() => {
		if (!mapRef.current) return

		// Create popup element
		const popupElement = document.createElement('div')
		popupElement.className = 'ol-popup'
		popupElement.style.display = 'none'
		if (popupRef.current) {
			popupRef.current.appendChild(popupElement)
		}

		// Create popup overlay
		const popupOverlay = new Overlay({
			element: popupElement,
			autoPan: {
				animation: {
					duration: 250,
				},
			},
		})
		popupOverlayRef.current = popupOverlay

		// Create vector sources for markers
		const markersSource = new VectorSource()
		markersSourceRef.current = markersSource

		const userLocationSource = new VectorSource()
		userLocationSourceRef.current = userLocationSource

		// Create vector layers
		const markersLayer = new VectorLayer({
			source: markersSource,
		})

		const userLocationLayer = new VectorLayer({
			source: userLocationSource,
		})

		// Create map with ultra-optimized tile source for maximum speed
		const tileSource = new XYZ({
			// Using CartoDB Light with maximum subdomains (a-d) for maximum parallel loading
			// @2x for retina displays, but we'll use regular for faster loading
			url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
			attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			maxZoom: 18, // Lower max zoom for faster loading (18 is usually sufficient)
			crossOrigin: 'anonymous',
			// Maximum cache size for fastest tile retrieval
			cacheSize: 2048, // Doubled cache size
			// No transition for instant tile updates
			transition: 0,
			// Optimized tile loading - using default but with crossOrigin set
		})

		const map = new Map({
			target: mapRef.current,
			layers: [
				new TileLayer({
					source: tileSource,
					// Maximum preloading for instant navigation
					preload: 4, // Increased from 3 to 4
					opacity: 1,
					// Use extent to limit tile loading to visible area
					extent: undefined, // Load all tiles for smoother panning
				}),
				markersLayer,
				userLocationLayer,
			],
			view: new View({
				center: fromLonLat([center?.lng || 3.3792, center?.lat || 6.5244]),
				zoom: zoom,
				// Maximum performance optimizations
				enableRotation: false,
				smoothExtentConstraint: true,
				constrainResolution: false,
			}),
			overlays: [popupOverlay],
			// Performance optimizations
			pixelRatio: Math.min(window.devicePixelRatio || 1, 2), // Limit pixel ratio for faster rendering
		})

		// Handle map clicks and marker clicks
		map.on('singleclick', (event) => {
			const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature)
			
			if (feature) {
				const geometry = feature.getGeometry()
				if (geometry instanceof Point) {
					const coordinates = geometry.getCoordinates()
					const lonLat = toLonLat(coordinates)
					
					// Get report data from feature
					const reportData = feature.get('reportData')
					const isUserLocation = feature.get('isUserLocation')
					
					if (reportData) {
						// Render disaster popup
						const popupContent = document.createElement('div')
						popupContent.className = 'min-w-[250px]'
						
						// Create close button
						const closeButton = document.createElement('a')
						closeButton.className = 'ol-popup-closer'
						closeButton.href = '#'
						closeButton.innerHTML = '×'
						closeButton.onclick = (e) => {
							e.preventDefault()
							popupOverlay.setPosition(undefined)
							return false
						}
						
						// Create popup content
						const content = document.createElement('div')
						content.className = 'space-y-2'
						content.innerHTML = `
							<div class="flex items-center gap-2">
								<span class="text-lg">${getDisasterEmoji(reportData.type)}</span>
								<div>
									<h3 class="font-semibold text-gray-900">${getDisasterDisplayName(reportData.type)}</h3>
									<span class="text-xs px-2 py-1 rounded-full ${getStatusColor(reportData.status)}">${reportData.status}</span>
								</div>
							</div>
							<p class="text-sm text-gray-700">${reportData.description}</p>
							<div class="text-xs text-gray-500 space-y-1">
								<div>📍 ${reportData.location.lat.toFixed(4)}, ${reportData.location.lng.toFixed(4)}</div>
								${reportData.imageUrl ? `<div class="mt-2"><img src="${reportData.imageUrl}" alt="Disaster report" class="w-full h-24 object-cover rounded" /></div>` : ''}
							</div>
						`
						
						popupContent.appendChild(closeButton)
						popupContent.appendChild(content)
						
						popupElement.innerHTML = ''
						popupElement.appendChild(popupContent)
						popupOverlay.setPosition(coordinates)
					} else if (isUserLocation) {
						// Render user location popup
						const closeButton = document.createElement('a')
						closeButton.className = 'ol-popup-closer'
						closeButton.href = '#'
						closeButton.innerHTML = '×'
						closeButton.onclick = (e) => {
							e.preventDefault()
							popupOverlay.setPosition(undefined)
							return false
						}
						
						popupElement.innerHTML = `
							${closeButton.outerHTML}
							<div class="text-center">
								<div class="font-semibold text-blue-600">📍 Your Location</div>
								<div class="text-sm text-gray-600">${lonLat[1].toFixed(4)}, ${lonLat[0].toFixed(4)}</div>
							</div>
						`
						popupOverlay.setPosition(coordinates)
					}
				}
			} else {
				// No feature clicked - handle map click callback
				if (onMapClick) {
					const coordinates = toLonLat(event.coordinate)
					onMapClick({
						lng: coordinates[0],
						lat: coordinates[1],
					})
				}
				// Close popup if clicking elsewhere
				popupOverlay.setPosition(undefined)
			}
		})

		mapInstanceRef.current = map

		return () => {
			map.setTarget(undefined)
		}
	}, [])

	// Update markers when reports change
	useEffect(() => {
		if (!markersSourceRef.current) return

		markersSourceRef.current.clear()

		reports.forEach((report) => {
			const feature = new Feature({
				geometry: new Point(fromLonLat([report.location.lng, report.location.lat])),
			})
			feature.setStyle(createDisasterIconStyle(report.type))
			feature.set('reportData', report)
			markersSourceRef.current?.addFeature(feature)
		})
	}, [reports])

	// Update user location marker
	useEffect(() => {
		if (!userLocationSourceRef.current) return

		userLocationSourceRef.current.clear()

		if (userLocation) {
			const feature = new Feature({
				geometry: new Point(fromLonLat([userLocation.lng, userLocation.lat])),
			})
			feature.setStyle(createUserLocationStyle())
			feature.set('isUserLocation', true)
			userLocationSourceRef.current.addFeature(feature)
		}
	}, [userLocation])

	// Handle center and zoom changes with smooth animation
	useEffect(() => {
		if (!mapInstanceRef.current) return

		const targetCenter = center || selectedReport?.location || userLocation
		if (!targetCenter) return

		// Only animate if center has changed
		if (
			!previousCenterRef.current ||
			previousCenterRef.current.lat !== targetCenter.lat ||
			previousCenterRef.current.lng !== targetCenter.lng
		) {
			const view = mapInstanceRef.current.getView()
			const targetZoom = center || selectedReport ? 15 : zoom

			view.animate({
				center: fromLonLat([targetCenter.lng, targetCenter.lat]),
				zoom: targetZoom,
				duration: 1000,
			})

			previousCenterRef.current = targetCenter
		}
	}, [center, selectedReport, userLocation, zoom])

	return (
		<div className={cn('w-full h-full relative', className)} style={{ transform: 'translateZ(0)' }}>
			<div 
				ref={mapRef} 
				className="w-full h-full"
				style={{ 
					transform: 'translateZ(0)',
					willChange: 'transform',
					backfaceVisibility: 'hidden'
				}} 
			/>
			<div ref={popupRef} className="absolute top-0 left-0 pointer-events-none" />
		</div>
	)
}
