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
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<App />
						<ReactQueryDevtools initialIsOpen={false} />
					</BrowserRouter>
				</QueryClientProvider>
			</GoogleOAuthProvider>
		</Provider>
	</StrictMode>,
)
