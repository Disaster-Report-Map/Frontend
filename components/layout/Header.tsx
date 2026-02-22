'use client'
import React from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Give active links a slightly different style
  const linkStyle = (path: string) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[1000] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-blue-600 dark:text-blue-500 text-2xl">⚡</span> DRM
        </Link>
        
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className={linkStyle('/dashboard')}>
                Dashboard
              </Link>
              <Link href="/my-reports" className={linkStyle('/my-reports')}>
                Reports
              </Link>
              <Link href="/settings" className={linkStyle('/settings')}>
                Settings
              </Link>
              <button
                onClick={logout}
                className="ml-2 px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkStyle('/login')}>
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
