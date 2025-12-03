import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	children: React.ReactNode
	size?: 'sm' | 'md' | 'lg' | 'xl'
	className?: string
}

export const Modal = ({ 
	isOpen, 
	onClose, 
	title, 
	children, 
	size = 'md',
	className 
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, onClose])

	useEffect(() => {
		if (isOpen && modalRef.current) {
			modalRef.current.focus()
		}
	}, [isOpen])

	if (!isOpen) return null



	const modalContent = (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>
			
			{/* Modal */}
			<div
				ref={modalRef}
				className={cn(
					'relative w-full bg-white rounded-lg shadow-xl transform transition-all max-h-[90vh] overflow-y-auto',
					// Mobile responsive sizing
					'mx-4 sm:mx-0',
					// Size classes with mobile adjustments
					size === 'sm' && 'max-w-md',
					size === 'md' && 'max-w-lg',
					size === 'lg' && 'max-w-2xl',
					size === 'xl' && 'max-w-4xl',
					className
				)}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? 'modal-title' : undefined}
				tabIndex={-1}
			>
				{/* Header */}
				{(title || typeof onClose === 'function') && (
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						{title && (
							<h2 id="modal-title" className="text-lg font-semibold text-gray-900">
								{title}
							</h2>
						)}
						{onClose && (
							<button
								onClick={onClose}
								className="text-gray-400 hover:text-gray-600 transition-colors"
								aria-label="Close modal"
							>
								<X className="h-5 w-5" />
							</button>
						)}
					</div>
				)}
				
				{/* Content */}
				<div className="p-6">
					{children}
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}
