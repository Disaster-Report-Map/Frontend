import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../hooks/auth/useAuth'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export function GoogleSignInButton() {
	const { googleSignIn, isLoading } = useAuth()
	const navigate = useNavigate()

	// Check if Google Client ID is configured - must be non-empty string
	const isGoogleConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.trim().length > 0)

	// Early return if not configured - prevents useGoogleLogin from being called
	if (!isGoogleConfigured) {
		return (
			<Button
				type="button"
				disabled
				className="w-full bg-gray-300 text-gray-500 border border-gray-300 cursor-not-allowed flex items-center justify-center"
			>
				<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="currentColor"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="currentColor"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="currentColor"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				Google Sign-In (Not Configured)
			</Button>
		)
	}

	// Only call useGoogleLogin if client ID is properly configured
	const login = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				// Get user info to verify the token works
				const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: `Bearer ${tokenResponse.access_token}`,
					},
				})

				if (!userInfoResponse.ok) {
					throw new Error('Failed to get user info from Google')
				}

				// Note: Backend expects ID token, but @react-oauth/google gives us access token
				// We need to use Google Identity Services to get ID token
				// For now, we'll send the access token and update backend to handle it
				// OR use a different library that gives us ID token directly
				
				// Temporary workaround: Use access token
				// In production, implement Google Identity Services for ID token
				const result = await googleSignIn(tokenResponse.access_token)
				if (result.type === 'auth/googleSignIn/fulfilled') {
					toast.success('Signed in with Google!')
					navigate('/', { replace: true })
				} else {
					const errorMessage = (result.payload as string) || 'Google sign-in failed'
					toast.error(errorMessage)
				}
			} catch (error: any) {
				const errorMessage = error?.message || error?.response?.data?.error || 'Google sign-in failed'
				toast.error(errorMessage)
			}
		},
		onError: () => {
			toast.error('Google sign-in failed')
		},
	})

	return (
		<Button
			type="button"
			onClick={() => login()}
			disabled={isLoading}
			className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
		>
			<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="currentColor"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="currentColor"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				/>
				<path
					fill="currentColor"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
			{isLoading ? 'Signing in...' : 'Sign in with Google'}
		</Button>
	)
}

