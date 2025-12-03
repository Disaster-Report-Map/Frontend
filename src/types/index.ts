export type DisasterType = 'flood' | 'fire' | 'accident' | 'collapse'

export interface Coordinates {
	lat: number
	lng: number
}

export interface DisasterReport {
	id: string
	type: DisasterType
	description: string
	location: Coordinates
	timestamp: string
	imageUrl?: string
	status: 'active' | 'resolved' | 'investigating'
	reporterId?: string
}

export interface CreateReportRequest {
	type: DisasterType
	description: string
	location: Coordinates
	imageFile?: File
}

export interface CreateReportResponse {
	success: boolean
	report?: DisasterReport
	error?: string
}

export interface ReportsResponse {
	reports: DisasterReport[]
	total: number
}

export interface AISummary {
	summary: string
	last24Hours: {
		floods: number
		fires: number
		accidents: number
		collapses: number
	}
	location: string
	generatedAt: string
}

export interface UserLocation {
	lat: number
	lng: number
	accuracy?: number
	timestamp: number
}

export interface ProximityAlert {
	id: string
	reportId: string
	distance: number
	message: string
	timestamp: string
	dismissed: boolean
}

export interface MapFilter {
	types: DisasterType[]
	status: ('active' | 'resolved' | 'investigating')[]
	timeRange: 'all' | '24h' | '7d' | '30d'
}

export interface ApiError {
	message: string
	code?: string
	details?: Record<string, unknown>
}

export interface ApiResponse<T> {
	data: T
	success: boolean
	error?: ApiError
}
