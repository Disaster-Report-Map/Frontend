// Environment configuration
export const config = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://disaster-report-map.onrender.com/api',
	useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
	isDevelopment: import.meta.env.DEV,
	isProduction: import.meta.env.PROD,
}
