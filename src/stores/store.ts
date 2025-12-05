import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { authMiddleware } from '../middleware/authMiddleware'

export const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['auth/setCredentials'],
			},
		}).concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

