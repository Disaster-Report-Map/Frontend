import { useState, useRef, useEffect } from 'react'
import { MapPin, Camera } from 'lucide-react'
import { Button } from '../ui/Button'
import { useCreateReport } from '../../hooks/api/useReports'
import { useGeolocation } from '../../hooks/geolocation/useGeolocation'
import { isValidImageFile, formatFileSize } from '../../utils'
import type { DisasterType, Coordinates } from '../../types'
import { showAlert } from '../layout/AlertBanner'

interface ReportFormProps {
	onSuccess?: () => void
	onCancel?: () => void
	initialLocation?: Coordinates | null
}

const disasterTypes: { value: DisasterType; label: string; emoji: string }[] = [
	{ value: 'flood', label: 'Flood', emoji: '🌊' },
	{ value: 'fire', label: 'Fire', emoji: '🔥' },
	{ value: 'accident', label: 'Accident', emoji: '🚑' },
	{ value: 'collapse', label: 'Building Collapse', emoji: '🏚️' },
]

export const ReportForm = ({ onSuccess, onCancel, initialLocation }: ReportFormProps) => {
	const [formData, setFormData] = useState({
		type: '' as DisasterType | '',
		description: '',
		location: initialLocation || null as Coordinates | null,
	})
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [locationError, setLocationError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const { location: userLocation, getCurrentPosition, loading: locationLoading, error: geoError } = useGeolocation()
	const createReportMutation = useCreateReport()

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleLocationClick = () => {
		setLocationError(null)
		getCurrentPosition()
	}

	// Handle geolocation errors
	useEffect(() => {
		if (geoError) {
			setLocationError(geoError)
		}
	}, [geoError])

	// Update form location when userLocation changes
	useEffect(() => {
		if (userLocation) {
			setFormData(prev => ({ ...prev, location: userLocation }))
		}
	}, [userLocation])

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!isValidImageFile(file)) {
			showAlert({
				type: 'error',
				title: 'Invalid File',
				message: 'Please select a valid image file (JPEG, PNG, GIF, WebP) under 5MB'
			})
			return
		}

		setImageFile(file)
		
		// Create preview
		const reader = new FileReader()
		reader.onload = (e) => {
			setImagePreview(e.target?.result as string)
		}
		reader.readAsDataURL(file)
	}

	const removeImage = () => {
		setImageFile(null)
		setImagePreview(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		if (!formData.type) {
			showAlert({
				type: 'error',
				title: 'Missing Information',
				message: 'Please select a disaster type'
			})
			return
		}

		if (!formData.description.trim()) {
			showAlert({
				type: 'error',
				title: 'Missing Information',
				message: 'Please provide a description'
			})
			return
		}

		if (!formData.location) {
			setLocationError('Please select a location')
			return
		}

		try {
			await createReportMutation.mutateAsync({
				type: formData.type,
				description: formData.description.trim(),
				location: formData.location,
				imageFile: imageFile || undefined,
			})

			showAlert({
				type: 'success',
				title: 'Report Submitted',
				message: 'Your disaster report has been submitted successfully!'
			})
			onSuccess?.()
		} catch (error) {
			console.error('Report submission error:', error)
			// Check if the error is actually a success (sometimes the response parsing fails)
			if (error instanceof Error && error.message.includes('success')) {
				showAlert({
					type: 'success',
					title: 'Report Submitted',
					message: 'Your disaster report has been submitted successfully!'
				})
				onSuccess?.()
			} else {
				showAlert({
					type: 'error',
					title: 'Submission Failed',
					message: 'Failed to submit report. Please try again.'
				})
			}
		}
	}

	const isFormValid = formData.type && formData.description.trim() && formData.location

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Disaster Type */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Disaster Type *
				</label>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{disasterTypes.map((type) => (
						<button
							key={type.value}
							type="button"
							onClick={() => handleInputChange('type', type.value)}
							className={`p-3 border rounded-lg text-left transition-colors ${
								formData.type === type.value
									? 'border-primary-500 bg-primary-50 text-primary-700'
									: 'border-gray-300 hover:border-gray-400'
							}`}
						>
							<div className="flex items-center gap-2">
								<span className="text-lg">{type.emoji}</span>
								<span className="font-medium">{type.label}</span>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Description */}
			<div>
				<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
					Description *
				</label>
				<textarea
					id="description"
					value={formData.description}
					onChange={(e) => handleInputChange('description', e.target.value)}
					placeholder="Describe the disaster in detail..."
					rows={4}
					className="input"
					required
				/>
			</div>

			{/* Location */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Location *
				</label>
				
				{formData.location ? (
					<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
						<div className="flex items-center gap-2 text-green-700">
							<MapPin className="h-4 w-4" />
							<span className="text-sm">
								{formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
							</span>
							{(formData.location as any).accuracy && (
								<span className="text-xs text-green-600">
									(±{Math.round((formData.location as any).accuracy)}m)
								</span>
							)}
						</div>
						<div className="flex gap-2 mt-2">
							<button
								type="button"
								onClick={handleLocationClick}
								disabled={locationLoading}
								className="text-xs text-green-600 hover:text-green-800 disabled:opacity-50"
							>
								{locationLoading ? 'Updating...' : 'Update location'}
							</button>
							<button
								type="button"
								onClick={() => setFormData(prev => ({ ...prev, location: null }))}
								className="text-xs text-red-600 hover:text-red-800"
							>
								Remove location
							</button>
						</div>
					</div>
				) : (
					<div className="space-y-2">
						<Button
							type="button"
							variant="secondary"
							onClick={handleLocationClick}
							loading={locationLoading}
							className="w-full"
						>
							<MapPin className="h-4 w-4 mr-2" />
							Use Current Location
						</Button>
						
						{geoError && (
							<p className="text-sm text-red-600">{geoError}</p>
						)}
						
						{locationError && (
							<p className="text-sm text-red-600">{locationError}</p>
						)}
						
						<p className="text-xs text-gray-500">
							Or click on the map to select a location
						</p>
					</div>
				)}
			</div>

			{/* Image Upload */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Photo (Optional)
				</label>
				
				{imagePreview ? (
					<div className="space-y-2">
						<img
							src={imagePreview}
							alt="Preview"
							className="w-full h-32 object-cover rounded-lg border"
						/>
						<div className="flex items-center justify-between text-sm text-gray-600">
							<span>{imageFile?.name} ({formatFileSize(imageFile?.size || 0)})</span>
							<button
								type="button"
								onClick={removeImage}
								className="text-red-600 hover:text-red-800"
							>
								Remove
							</button>
						</div>
					</div>
				) : (
					<div
						onClick={() => fileInputRef.current?.click()}
						className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors"
					>
						<Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
						<p className="text-sm text-gray-600">Click to upload a photo</p>
						<p className="text-xs text-gray-500">JPEG, PNG, GIF, WebP (max 5MB)</p>
					</div>
				)}
				
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="hidden"
				/>
			</div>

			{/* Submit Buttons */}
			<div className="flex flex-col sm:flex-row gap-3 pt-4">
				<Button
					type="submit"
					disabled={!isFormValid || createReportMutation.isPending}
					loading={createReportMutation.isPending}
					className="flex-1"
				>
					Submit Report
				</Button>
				
				{onCancel && (
					<Button
						type="button"
						variant="secondary"
						onClick={onCancel}
						disabled={createReportMutation.isPending}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
				)}
			</div>
		</form>
	)
}
