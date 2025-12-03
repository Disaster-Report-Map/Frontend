import { Bot, TrendingUp, MapPin, Clock } from 'lucide-react'
import { useAISummary } from '../../hooks/api/useReports'
import { getDisasterEmoji } from '../../utils'
import { cn } from '../../utils/cn'

interface AISummaryProps {
	className?: string
}

export const AISummary = ({ className }: AISummaryProps) => {
	const { data: summary, isLoading, error } = useAISummary()

	if (isLoading) {
		return (
			<div className={cn('card', className)}>
				<div className="animate-pulse">
					<div className="flex items-center gap-2 mb-3">
						<div className="h-5 w-5 bg-gray-300 rounded"></div>
						<div className="h-4 bg-gray-300 rounded w-24"></div>
					</div>
					<div className="space-y-2">
						<div className="h-3 bg-gray-300 rounded"></div>
						<div className="h-3 bg-gray-300 rounded w-3/4"></div>
					</div>
				</div>
			</div>
		)
	}

	if (error || !summary) {
		return (
			<div className={cn('card border-red-200 bg-red-50', className)}>
				<div className="flex items-center gap-2 text-red-600 mb-2">
					<Bot className="h-4 w-4" />
					<span className="text-sm font-medium">AI Summary</span>
				</div>
				<p className="text-sm text-red-600">
					Unable to load AI summary
				</p>
			</div>
		)
	}

	const totalReports = Object.values(summary.last24Hours).reduce((sum, count) => sum + count, 0)

	return (
		<div className={cn('card', className)}>
			{/* Header */}
			<div className="flex items-center gap-2 mb-3">
				<Bot className="h-4 w-4 text-gray-800" />
				<span className="text-sm font-medium text-gray-900">AI Summary</span>
				<div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
					<Clock className="h-3 w-3" />
					<span>24h</span>
				</div>
			</div>

			{/* Summary Text */}
			<p className="text-sm text-gray-700 mb-4 leading-relaxed">
				{summary.summary}
			</p>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-3 mb-4">
				{Object.entries(summary.last24Hours).map(([type, count]) => (
					<div key={type} className="text-center p-2 bg-gray-50 rounded">
						<div className="text-lg mb-1">{getDisasterEmoji(type as any)}</div>
						<div className="text-lg font-semibold text-gray-900">{count}</div>
						<div className="text-xs text-gray-600 capitalize">{type}</div>
					</div>
				))}
			</div>

			{/* Location and Total */}
			<div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
				<div className="flex items-center gap-1">
					<MapPin className="h-3 w-3" />
					<span>{summary.location}</span>
				</div>
				
				<div className="flex items-center gap-1">
					<TrendingUp className="h-3 w-3" />
					<span>{totalReports} total reports</span>
				</div>
			</div>

			{/* Generated timestamp */}
			<div className="text-xs text-gray-400 mt-2 text-center">
				Generated {new Date(summary.generatedAt).toLocaleTimeString()}
			</div>
		</div>
	)
}
