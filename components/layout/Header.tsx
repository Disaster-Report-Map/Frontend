'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { usePathname } from 'next/navigation'
import { Menu, X, MapPinned, FileText, Settings, LogOut } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Desktop active links
  const linkStyle = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
      pathname === path
        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
    }`;
    
  // Mobile active links
  const mobileLinkStyle = (path: string) =>
    `block px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 ${
      pathname === path
        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[1000] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          DRM
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className={linkStyle('/dashboard')}>
                <MapPinned className="w-4 h-4" /> Reports
              </Link>
              <Link href="/my-reports" className={linkStyle('/my-reports')}>
                <FileText className="w-4 h-4" /> My Reports
              </Link>
              <Link href="/settings" className={linkStyle('/settings')}>
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 flex items-center gap-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkStyle('/login')}>
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[2000] md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-2xl flex flex-col pt-5 pb-6 px-4 animate-in slide-in-from-right-full duration-200">
            <div className="flex items-center justify-between mb-8">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Menu</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className={mobileLinkStyle('/dashboard')}>
                    <MapPinned className="w-5 h-5" /> Reports
                  </Link>
                  <Link href="/my-reports" onClick={() => setIsMenuOpen(false)} className={mobileLinkStyle('/my-reports')}>
                    <FileText className="w-5 h-5" /> My Reports
                  </Link>
                  <Link href="/settings" onClick={() => setIsMenuOpen(false)} className={mobileLinkStyle('/settings')}>
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                  
                  <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full flex justify-center items-center gap-2 px-4 py-3 text-base font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                    >
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className={mobileLinkStyle('/login')}>
                      <LogOut className="rotate-180 w-5 h-5" /> Sign In
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
