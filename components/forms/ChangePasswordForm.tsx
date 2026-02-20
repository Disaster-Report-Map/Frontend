'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { changePasswordSchema } from '../../lib/validators'
import { userApi } from '../../lib/api'
import Button from '../ui/Button'

type FormValues = z.infer<typeof changePasswordSchema>

export default function ChangePasswordForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(changePasswordSchema)
    })

    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        setMessage(null)
        try {
            await userApi.changePassword(data)
            setMessage({ type: 'success', text: 'Password updated successfully!' })
            reset()
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Change Password</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input
                        type="password"
                        {...register('currentPassword')}
                        className={`w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.currentPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                        type="password"
                        {...register('newPassword')}
                        className={`w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.newPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        {...register('confirmPassword')}
                        className={`w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {message && (
                    <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Updating...' : 'Update Password'}
                </Button>
            </form>
        </div>
    )
}
