import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../stores/store'
import { login, register, googleSignIn, logout, getCurrentUser, clearError } from '../../stores/slices/authSlice'
import type { LoginCredentials, RegisterCredentials } from '../../types/auth'

export const useAuth = () => {
	const dispatch = useDispatch()
	const auth = useSelector((state: RootState) => state.auth)

	return {
		...auth,
		login: (credentials: LoginCredentials) => dispatch(login(credentials)),
		register: (credentials: RegisterCredentials) => dispatch(register(credentials)),
		googleSignIn: (token: string) => dispatch(googleSignIn(token)),
		logout: () => dispatch(logout()),
		getCurrentUser: () => dispatch(getCurrentUser()),
		clearError: () => dispatch(clearError()),
	}
}

