import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../hooks/auth/useAuth'
import { Button } from '../../components/ui/Button'
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function RegisterView() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const { register, isLoading, error, clearError } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		clearError()

		if (password !== passwordConfirm) {
			toast.error('Passwords do not match')
			return
		}

		if (password.length < 8) {
			toast.error('Password must be at least 8 characters long')
			return
		}

		try {
			const result = await register({
				email,
				password,
				password_confirm: passwordConfirm,
				first_name: firstName || undefined,
				last_name: lastName || undefined,
			})
			if (result.type === 'auth/register/fulfilled') {
				toast.success('Registration successful!')
				navigate('/', { replace: true })
			} else {
				const errorMessage = (result.payload as string) || error || 'Registration failed'
				toast.error(errorMessage)
			}
		} catch (err: any) {
			const errorMessage = err?.message || error || 'Registration failed. Please try again.'
			toast.error(errorMessage)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<button
							onClick={() => navigate('/login')}
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							sign in to existing account
						</button>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<div className="text-sm text-red-800">{error}</div>
						</div>
					)}

					<div className="rounded-md shadow-sm space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="firstName" className="sr-only">
									First name
								</label>
								<input
									id="firstName"
									name="firstName"
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="First name (optional)"
								/>
							</div>
							<div>
								<label htmlFor="lastName" className="sr-only">
									Last name
								</label>
								<input
									id="lastName"
									name="lastName"
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Last name (optional)"
								/>
							</div>
						</div>

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
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
								autoComplete="new-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Password"
							/>
						</div>

						<div>
							<label htmlFor="passwordConfirm" className="sr-only">
								Confirm password
							</label>
							<input
								id="passwordConfirm"
								name="passwordConfirm"
								type="password"
								autoComplete="new-password"
								required
								value={passwordConfirm}
								onChange={(e) => setPasswordConfirm(e.target.value)}
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Confirm password"
							/>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full"
						>
							{isLoading ? 'Creating account...' : 'Create account'}
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

