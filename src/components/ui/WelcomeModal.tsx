import { useState } from 'react'
import { MapPin, AlertTriangle, Camera, Users, Brain, Shield, ArrowRight, CheckCircle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { cn } from '../../utils/cn'
import logo from '../../assets/logo.png'

interface WelcomeModalProps {
	isOpen: boolean
	onClose: () => void
	onContinue: () => void
}

const features = [
	{
		icon: MapPin,
		title: 'Interactive Disaster Map',
		description: 'View real-time disaster reports on an interactive map with precise location markers and status updates.',
		color: 'text-blue-600',
		bgColor: 'bg-blue-50',
	},
	{
		icon: AlertTriangle,
		title: 'Emergency Reporting',
		description: 'Report disasters instantly with geolocation, photos, and detailed descriptions. Help keep your community safe.',
		color: 'text-red-600',
		bgColor: 'bg-red-50',
	},
	{
		icon: Camera,
		title: 'Photo Evidence',
		description: 'Upload photos to provide visual evidence of incidents, helping emergency responders assess situations quickly.',
		color: 'text-green-600',
		bgColor: 'bg-green-50',
	},
	{
		icon: Users,
		title: 'Community Alerts',
		description: 'Get proximity alerts for nearby emergencies and stay informed about incidents in your area.',
		color: 'text-purple-600',
		bgColor: 'bg-purple-50',
	},
	{
		icon: Brain,
		title: 'AI-Powered Insights',
		description: 'Receive intelligent summaries and safety recommendations powered by advanced AI analysis.',
		color: 'text-orange-600',
		bgColor: 'bg-orange-50',
	},
	{
		icon: Shield,
		title: 'Real-Time Updates',
		description: 'Track incident status changes and get live updates as emergency services respond to reports.',
		color: 'text-indigo-600',
		bgColor: 'bg-indigo-50',
	},
]

export const WelcomeModal = ({ isOpen, onClose, onContinue }: WelcomeModalProps) => {
	const [currentStep, setCurrentStep] = useState(0)
	const [isCompleting, setIsCompleting] = useState(false)

	const handleContinue = async () => {
		setIsCompleting(true)
		// Small delay for smooth UX
		await new Promise(resolve => setTimeout(resolve, 300))
		onContinue()
		setIsCompleting(false)
	}

	const handleNext = () => {
		if (currentStep < 2) {
			setCurrentStep(currentStep + 1)
		}
	}

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1)
		}
	}

	const renderStep = () => {
		switch (currentStep) {
			case 0:
				return (
					<div className="text-center space-y-6">
						{/* Hero Section */}
						<div className="space-y-4">
							<div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center">
								<img src={logo} alt="Disaster Response Map" className="h-15 w-15 rounded-full" />
							</div>
							<h1 className="text-3xl font-bold text-gray-900">
								Welcome to Disaster Response Map
							</h1>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto">
								A comprehensive platform for real-time disaster reporting and community safety. 
								Help keep your community informed and safe during emergencies.
							</p>
						</div>

						{/* Key Stats */}
						<div className="grid md:grid-cols-3 grid-cols-1 gap-2 sm:gap-4 max-w-md mx-auto">
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">24/7</div>
								<div className="text-sm text-gray-600">Monitoring</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">Real-time</div>
								<div className="text-sm text-gray-600">Updates</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-purple-600">AI-Powered</div>
								<div className="text-sm text-gray-600">Insights</div>
							</div>
						</div>
					</div>
				)

			case 1:
				return (
					<div className="space-y-6">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Key Features
							</h2>
							<p className="text-gray-600">
								Discover how our platform helps keep communities safe
							</p>
						</div>

						{/* Features Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-80 sm:max-h-96 overflow-y-auto">
							{features.map((feature, index) => {
								const Icon = feature.icon
								return (
									<div
										key={index}
										className={cn(
											'p-4 rounded-lg border transition-all duration-200 hover:shadow-md',
											feature.bgColor,
											'border-gray-200'
										)}
									>
										<div className="flex items-start space-x-3">
											<div className={cn('p-2 rounded-lg bg-white', feature.bgColor)}>
												<Icon className={cn('h-5 w-5', feature.color)} />
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 text-sm">
													{feature.title}
												</h3>
												<p className="text-xs text-gray-600 mt-1">
													{feature.description}
												</p>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)

			case 2:
				return (
					<div className="text-center space-y-6">
						{/* Success Icon */}
						<div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
							<CheckCircle className="h-10 w-10 text-white" />
						</div>

						{/* Final Message */}
						<div className="space-y-4">
							<h2 className="text-2xl font-bold text-gray-900">
								You're All Set!
							</h2>
							<p className="text-gray-600 max-w-md mx-auto">
								You're now ready to use the Disaster Response Map. Report incidents, 
								stay informed, and help keep your community safe.
							</p>
						</div>

						{/* Quick Tips */}
						<div className="bg-blue-50 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
							<h3 className="font-semibold text-blue-900 mb-2">Quick Tips:</h3>
							<ul className="text-sm text-blue-800 space-y-1 text-left">
								<li>• Click anywhere on the map to report an incident</li>
								<li>• Use the floating + button for quick reporting</li>
								<li>• Check the live feed for nearby emergencies</li>
								<li>• View AI summaries for safety insights</li>
							</ul>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
			className="max-w-4xl mx-2 sm:mx-0"
		>
			<div className="space-y-6">
				{/* Progress Bar */}
				<div className="flex items-center justify-center space-x-2">
					{[0, 1, 2].map((step) => (
						<div
							key={step}
							className={cn(
								'w-3 h-3 rounded-full transition-all duration-300',
								step <= currentStep
									? 'bg-blue-600'
									: 'bg-gray-300'
							)}
						/>
					))}
				</div>

				{/* Step Content */}
				<div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
					{renderStep()}
				</div>

				{/* Navigation */}
				<div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-3 sm:gap-0">
					<div>
						{currentStep > 0 && (
							<Button
								variant="secondary"
								onClick={handlePrevious}
								disabled={isCompleting}
							>
								Previous
							</Button>
						)}
					</div>

					<div className="flex items-center space-x-2 sm:space-x-3">
						{currentStep < 2 ? (
							<Button
								onClick={handleNext}
								disabled={isCompleting}
								className="flex items-center space-x-2"
							>
								<span>Next</span>
								<ArrowRight className="h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={handleContinue}
								disabled={isCompleting}
								className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
							>
								{isCompleting ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										<span>Getting Started...</span>
									</>
								) : (
									<>
										<span>Get Started</span>
										<ArrowRight className="h-4 w-4" />
									</>
								)}
							</Button>
						)}
					</div>
				</div>

				{/* Skip Option */}
				<div className="text-center">
					<button
						onClick={onClose}
						className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
						disabled={isCompleting}
					>
						Skip for now
					</button>
				</div>
			</div>
		</Modal>
	)
}
