'use client'
import React, { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function AccountInfoCard() {
    const user = useAuthStore((s) => s.user)
    const [copied, setCopied] = useState(false)

    if (!user) return null

    const handleCopy = () => {
        navigator.clipboard.writeText(user.id)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Account Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Role</label>
                    <div className="flex">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                            {user.role}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Member Since</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {formatDate(user.createdAt)}
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">User ID</label>
                    <div className="flex items-center space-x-2">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-mono truncate max-w-[120px]">
                            {user.id}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Copy ID"
                        >
                            {copied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
