'use client'
import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { userApi } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

export default function DangerZone() {
    const [showModal, setShowModal] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { logout } = useAuth()

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') return

        setLoading(true)
        setError(null)
        try {
            await userApi.deleteAccount()
            await logout()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete account')
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-red-200 dark:border-red-900/30 mt-6">
            <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Deleting your account is permanent and cannot be undone. All your reports and data will be removed.
            </p>

            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium"
            >
                Delete Account
            </button>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <div className="p-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you absolutely sure?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This action will permanently delete your account. To confirm, please type <span className="font-bold text-red-600 italic">DELETE</span> below.
                    </p>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={confirmText !== 'DELETE' || loading}
                            onClick={handleDelete}
                            className={`flex-1 px-4 py-2 rounded text-white transition-colors ${confirmText === 'DELETE' && !loading
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-red-300 cursor-not-allowed'
                                }`}
                        >
                            {loading ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
