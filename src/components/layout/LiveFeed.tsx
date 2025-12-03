import { useState } from 'react'
import { RefreshCw, Filter } from 'lucide-react'
import { Button } from '../ui/Button'
import { DisasterCard } from '../map/DisasterCard'
import { useReports } from '../../hooks/api/useReports'
import { getDisasterDisplayName } from '../../utils'
import type { DisasterReport, DisasterType, UserLocation } from '../../types'
import { cn } from '../../utils/cn'

interface LiveFeedProps {
	userLocation: UserLocation | null
	onReportClick?: (report: DisasterReport) => void
	className?: string
}

const disasterTypes: DisasterType[] = ['flood', 'fire', 'accident', 'collapse']

export const LiveFeed = ({ userLocation, onReportClick, className }: LiveFeedProps) => {
	const [selectedTypes, setSelectedTypes] = useState<DisasterType[]>([])
	const [showFilters, setShowFilters] = useState(false)
	
	const { data: reportsData, isLoading, error, refetch, isFetching } = useReports()

	const reports = reportsData?.reports || []

	// Filter reports by selected types
	const filteredReports = selectedTypes.length > 0 
		? reports.filter(report => selectedTypes.includes(report.type))
		: reports

	const toggleTypeFilter = (type: DisasterType) => {
		setSelectedTypes(prev => 
			prev.includes(type) 
				? prev.filter(t => t !== type)
				: [...prev, type]
		)
	}

	const clearFilters = () => {
		setSelectedTypes([])
	}

	const getTypeCount = (type: DisasterType) => {
		return reports.filter(report => report.type === type).length
	}

	return (
		<div className={cn('bg-white border-l border-gray-200 flex flex-col h-full', className)}>
			{/* Header */}
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
					</div>
				</div>

				{/* Stats */}
				<div className="text-sm text-gray-600">
					{isLoading ? (
						'Loading reports...'
					) : (
						<>
							{filteredReports.length} of {reports.length} reports
							{isFetching && <span className="ml-2 text-blue-600">Updating...</span>}
						</>
					)}
				</div>
			</div>

			{/* Filters */}
			{showFilters && (
				<div className="p-4 border-b border-gray-200 bg-gray-50">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-sm font-medium text-gray-700">Filter by Type</h3>
						{selectedTypes.length > 0 && (
							<button
								onClick={clearFilters}
								className="text-xs text-blue-600 hover:text-blue-800"
							>
								Clear all
							</button>
						)}
					</div>
					
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
											? 'bg-primary-100 text-primary-700 border border-primary-200'
											: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
									)}
								>
									<span>{getDisasterDisplayName(type)}</span>
									<span className={cn(
										'text-xs px-1.5 py-0.5 rounded',
										isSelected ? 'bg-primary-200' : 'bg-gray-100'
									)}>
										{count}
									</span>
								</button>
							)
						})}
					</div>
				</div>
			)}

			{/* Reports List */}
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
						{filteredReports.map((report) => (
							<DisasterCard
								key={report.id}
								report={report}
								userLocation={userLocation}
								onClick={() => onReportClick?.(report)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
