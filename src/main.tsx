import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from './stores/store'
import 'ol/ol.css'
import './index.css'
import App from './App.tsx'

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
			retry: 2,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 1,
		},
	},
})

// Google OAuth Client ID - should be in env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// Validate that client ID is a non-empty string
const isGoogleConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.trim().length > 0)

// Warn if Google Client ID is missing (but don't break the app)
if (!isGoogleConfigured) {
	if (import.meta.env.DEV) {
		console.warn(
			'⚠️ VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In will not work. ' +
			'Please add it to your .env file: VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com'
		)
	} else {
		console.warn(
			'⚠️ VITE_GOOGLE_CLIENT_ID is not configured. Google Sign-In is disabled.'
		)
	}
}

// Only wrap with GoogleOAuthProvider if client ID is available and valid
const AppWithProviders = isGoogleConfigured ? (
	<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
				<ReactQueryDevtools initialIsOpen={false} />
			</BrowserRouter>
		</QueryClientProvider>
	</GoogleOAuthProvider>
) : (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<App />
			<ReactQueryDevtools initialIsOpen={false} />
		</BrowserRouter>
	</QueryClientProvider>
)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			{AppWithProviders}
		</Provider>
	</StrictMode>,
)
