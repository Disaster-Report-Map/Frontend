import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsApi } from '../../api/reports'
import type { CreateReportRequest, CreateReportResponse } from '../../types'

// Query keys
export const queryKeys = {
	reports: ['reports'] as const,
	aiSummary: ['aiSummary'] as const,
	reporterId: ['reporterId'] as const,
	health: ['health'] as const,
}

// Hook to fetch all reports with polling
export const useReports = () => {
	const query = useQuery({
		queryKey: queryKeys.reports,
		queryFn: reportsApi.getReports,
		refetchInterval: 10000, // Poll every 10 seconds
		refetchIntervalInBackground: true,
		staleTime: 5000, // Consider data stale after 5 seconds
		gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	})

	// Log data changes
	if (query.data) {
		console.log('Reports fetched:', query.data?.reports?.length, 'reports')
	}
	if (query.error) {
		console.error('Failed to fetch reports:', query.error)
	}

	return query
}

// Hook to create a new report
export const useCreateReport = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (reportData: CreateReportRequest) => reportsApi.createReport(reportData),
		onSuccess: (data: CreateReportResponse) => {
			console.log('Report created successfully:', data)
			// Invalidate and refetch reports
			queryClient.invalidateQueries({ queryKey: queryKeys.reports })
			// Also invalidate AI summary as it might change
			queryClient.invalidateQueries({ queryKey: queryKeys.aiSummary })
			console.log('Queries invalidated')
		},
		onError: (error: Error) => {
			console.error('Failed to create report:', error)
			// Even if there's an error, try to refresh the reports list
			// in case the report was actually created
			queryClient.invalidateQueries({ queryKey: queryKeys.reports })
		},
	})
}

// Hook to get AI summary
export const useAISummary = () => {
	return useQuery({
		queryKey: queryKeys.aiSummary,
		queryFn: reportsApi.getAISummary,
		refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
		staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
		retry: 2,
	})
}

// Hook to update report status

// Hook to get reporter ID (session-based)
export const useReporterId = () => {
	return useQuery({
		queryKey: queryKeys.reporterId,
		queryFn: reportsApi.getReporterId,
		staleTime: 30 * 60 * 1000, // Consider data stale after 30 minutes
		gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
		retry: 2,
		refetchOnWindowFocus: false, // Don't refetch on window focus for reporter ID
	})
}

// Hook for health check
export const useHealthCheck = () => {
	return useQuery({
		queryKey: queryKeys.health,
		queryFn: reportsApi.healthCheck,
		refetchInterval: 30 * 1000, // Poll every 30 seconds
		staleTime: 10 * 1000, // Consider data stale after 10 seconds
		gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
		retry: 1,
		refetchOnWindowFocus: true,
	})
}

// Hook for updating report status
export const useUpdateReportStatus = () => {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: ({ 
			reportId, 
			status, 
			reporterId 
		}: { 
			reportId: string
			status: 'active' | 'resolved' | 'investigating'
			reporterId: string
		}) => reportsApi.updateReportStatus(reportId, status, reporterId),
		onSuccess: () => {
			// Invalidate and refetch reports data
			queryClient.invalidateQueries({ queryKey: queryKeys.reports })
		},
		onError: (error) => {
			console.error('Failed to update report status:', error)
		},
	})
}
