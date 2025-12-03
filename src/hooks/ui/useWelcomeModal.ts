import { useState, useEffect } from 'react'

const WELCOME_MODAL_KEY = 'disaster-response-welcome-viewed'

export const useWelcomeModal = () => {
	const [shouldShow, setShouldShow] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Check if user has seen the welcome modal before
		const hasViewed = localStorage.getItem(WELCOME_MODAL_KEY)
		setShouldShow(!hasViewed)
		setIsLoading(false)
	}, [])

	const markWelcomeModalViewed = () => {
		localStorage.setItem(WELCOME_MODAL_KEY, 'true')
		setShouldShow(false)
	}

	const hideWelcomeModal = () => {
		setShouldShow(false)
	}

	return {
		shouldShow,
		isLoading,
		markWelcomeModalViewed,
		hideWelcomeModal,
	}
}
