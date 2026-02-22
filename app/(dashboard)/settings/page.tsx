'use client'
import React from 'react'
import SettingsForm from '../../../components/forms/SettingsForm'
import ChangePasswordForm from '../../../components/forms/ChangePasswordForm'
import AccountInfoCard from '../../../components/settings/AccountInfoCard'
import DangerZone from '../../../components/settings/DangerZone'
import { useAuth } from '../../../hooks/useAuth'

export default function SettingsPage() {
    const { logout } = useAuth()

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 italic">Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile information and security settings.</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                </button>
            </div>

            <AccountInfoCard />
            <SettingsForm />
            <ChangePasswordForm />
            <DangerZone />
        </div>
    )
}
