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
              toast: 'group bg-[#0a0a0a] border border-[#1a1a1a] rounded-[24px] shadow-2xl px-5 py-3.5 flex items-start gap-3 transition-all duration-300 cursor-default hover:bg-[#111]',
              title: 'text-[#22c55e] font-medium text-[15px]',
              description: 'text-white text-[14px] max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-2',
              icon: 'text-[#22c55e] bg-[#052e16] p-1.5 rounded-full mt-0.5'
            }
          }} 
        />
      </body>
    </html>
  )
}
