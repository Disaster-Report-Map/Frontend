import React from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="w-full bg-white dark:bg-gray-800 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold">DRM</Link>
          <nav className="flex gap-3">
            <Link href="/dashboard" className="px-3 py-1 rounded">Dashboard</Link>
            <Link href="/my-reports" className="px-3 py-1 rounded">My Reports</Link>
            <Link href="/settings" className="px-3 py-1 rounded">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full h-full relative flex flex-col">{children}</main>
    </div>
  )
}
