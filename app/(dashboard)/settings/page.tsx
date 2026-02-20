'use client'
import React from 'react'
import SettingsForm from '../../../components/forms/SettingsForm'
import ChangePasswordForm from '../../../components/forms/ChangePasswordForm'

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col space-y-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 italic">Settings</h2>
                <p className="text-gray-500 dark:text-gray-400">Manage your profile information and security settings.</p>
            </div>

            <SettingsForm />
            <ChangePasswordForm />
        </div>
    )
}
