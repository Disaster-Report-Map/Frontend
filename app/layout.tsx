import '../styles/globals.css'
import 'leaflet/dist/leaflet.css' // Fixes the vertical line / missing map CSS issue
import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Toaster } from 'sonner'
  
export const metadata = {
  title: 'Disaster Report Map (DRM)',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png', // Fallback for iOS bookmarks
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      {/* 
        `flex flex-col min-h-screen` guarantees the footer gets completely pushed 
        to the bottom of the visible screen on pages with short content (like login)
      */}
      <body className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-blue-600/30">
        <Header />
        
        {/* Core page routing layer takes remaining flex-1 space */}
        <main className="flex-1 flex flex-col w-full relative z-[1]">
          {children}
        </main>
        
        <Footer />
        <Toaster 
          position="top-center" 
          theme="dark" 
          toastOptions={{
            classNames: {
              toast: 'group bg-black border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[28px] px-6 py-4 flex flex-col items-start min-w-[320px] transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-default',
              title: 'text-[#22c55e] font-bold text-base flex items-center gap-3',
              description: 'text-white/80 text-sm overflow-hidden max-h-0 opacity-0 transition-all duration-500 ease-in-out group-hover:max-h-[80px] group-hover:opacity-100 group-hover:mt-2',
              icon: 'text-[#22c55e] bg-green-500/10 p-1 rounded-full'
            }
          }} 
        />
      </body>
    </html>
  )
}
