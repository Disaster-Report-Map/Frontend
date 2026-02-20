'use client'
import React, { useState, useRef } from 'react'
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
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.profileImageUrl || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.name || '',
            email: user?.email || '',
            profileImageUrl: user?.profileImageUrl || ''
        }
    })

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const dataUrl = reader.result as string
            setAvatarPreview(dataUrl)
            setValue('profileImageUrl', dataUrl)
        }
        reader.readAsDataURL(file)
    }

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
                {/* Clickable Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="relative group w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-500 cursor-pointer transition-all hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-blue-600 uppercase">{user?.name?.charAt(0)}</span>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Click to change photo</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
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
