'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Disaster Report Map</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Real-time disaster reporting platform.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
          <Link href="/register" className="px-4 py-2 border rounded">Register</Link>
        </div>
      </div>
    </main>
  )
}
