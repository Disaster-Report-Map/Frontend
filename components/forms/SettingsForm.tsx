'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { profileSchema } from '../../lib/validators'
import { userApi } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

type FormValues = z.infer<typeof profileSchema>

export default function SettingsForm() {
    const user = useAuthStore((s) => s.user)
    const setUser = useAuthStore((s) => s.setUser)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.name || '',
            email: user?.email || '',
            profileImageUrl: user?.profileImageUrl || ''
        }
    })

    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        setMessage(null)
        try {
            const res = await userApi.updateProfile(data)
            setUser(res.data)
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Profile Information</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-500">
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-blue-600 uppercase">{user?.name?.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL</label>
                        <input
                            {...register('profileImageUrl')}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                        {...register('fullName')}
                        className={`w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                        {...register('email')}
                        className={`w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {message && (
                    <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
        </div>
    )
}
