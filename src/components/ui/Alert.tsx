import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface AlertProps {
	type: 'info' | 'success' | 'warning' | 'error'
	title?: string
	children: React.ReactNode
	onDismiss?: () => void
	className?: string
}

export const Alert = ({ type, title, children, onDismiss, className }: AlertProps) => {
	const typeStyles = {
		info: 'bg-blue-50 border-blue-200 text-blue-800',
		success: 'bg-green-50 border-green-200 text-green-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		error: 'bg-red-50 border-red-200 text-red-800',
	}

	const iconStyles = {
		info: 'text-blue-400',
		success: 'text-green-400',
		warning: 'text-yellow-400',
		error: 'text-red-400',
	}

	return (
		<div
			className={cn(
				'border rounded-lg p-4',
				typeStyles[type],
				className
			)}
			role="alert"
		>
			<div className="flex">
				<div className="flex-shrink-0">
					{type === 'info' && (
						<svg className={cn('h-5 w-5', iconStyles[type])} viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					)}
					{type === 'success' && (
						<svg className={cn('h-5 w-5', iconStyles[type])} viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
					)}
					{type === 'warning' && (
						<svg className={cn('h-5 w-5', iconStyles[type])} viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
					)}
					{type === 'error' && (
						<svg className={cn('h-5 w-5', iconStyles[type])} viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
					)}
				</div>
				
				<div className="ml-3 flex-1">
					{title && (
						<h3 className="text-sm font-medium mb-1">
							{title}
						</h3>
					)}
					<div className="text-sm">
						{children}
					</div>
				</div>
				
				{onDismiss && (
					<div className="ml-auto pl-3">
						<div className="-mx-1.5 -my-1.5">
							<button
								type="button"
								onClick={onDismiss}
								className={cn(
									'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
									iconStyles[type],
									'hover:bg-opacity-20'
								)}
								aria-label="Dismiss"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
