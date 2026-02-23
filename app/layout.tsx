import '../styles/globals.css'
import 'leaflet/dist/leaflet.css' // Fixes the vertical line / missing map CSS issue
import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Toaster } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
  
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
          icons={{
            success: <div className="p-1 px-1.5 bg-green-500/20 rounded-full"><CheckCircle2 className="w-4 h-4 text-[#22c55e]" /></div>
          }}
          toastOptions={{
            classNames: {
              toast: 'group bg-transparent shadow-none border-0 flex justify-center w-full transition-all duration-300 pointer-events-auto',
              content: 'bg-black/90 backdrop-blur-xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] rounded-[32px] px-3 py-2 flex flex-col items-center w-fit max-w-[400px] transition-all duration-500 ease-in-out border border-white/5 group-hover:rounded-[24px] cursor-default',
              title: 'text-[#22c55e] font-bold text-[15px] px-4 py-2 flex items-center gap-2.5 whitespace-nowrap',
              description: 'text-white/90 text-center px-5 max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-[120px] group-hover:opacity-100 group-hover:pb-4 group-hover:pt-1',
              icon: 'hidden'
            }
          }} 
        />
      </body>
    </html>
  )
}
