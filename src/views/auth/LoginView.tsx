import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../hooks/auth/useAuth'
import { Button } from '../../components/ui/Button'
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'

export function LoginView() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { login, isLoading, error, clearError } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	// Get the intended destination from location state, or default to home
	const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		clearError()

		try {
			const result = await login({ email, password })
			if (result.type === 'auth/login/fulfilled') {
				toast.success('Login successful!')
				// Wait a brief moment to ensure Redux state is updated
				setTimeout(() => {
					navigate(from, { replace: true })
				}, 100)
			} else {
				const errorMessage = (result.payload as string) || error || 'Login failed'
				toast.error(errorMessage)
			}
		} catch (err: any) {
			const errorMessage = err?.message || error || 'Login failed. Please try again.'
			toast.error(errorMessage)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<button
							onClick={() => navigate('/register')}
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							create a new account
						</button>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<div className="text-sm text-red-800">{error}</div>
						</div>
					)}

					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full"
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
						</div>
					</div>

					<GoogleSignInButton />
				</form>
			</div>
		</div>
	)
}

