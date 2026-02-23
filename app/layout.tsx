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
            success: <div className="p-1 px-1.5 bg-green-500/10 rounded-full"><CheckCircle2 className="w-4 h-4 text-[#22c55e]" /></div>
          }}
          toastOptions={{
            classNames: {
              toast: 'group bg-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[32px] px-2 py-2 flex flex-col items-center w-fit min-w-[180px] max-w-sm transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] border-0 hover:rounded-[24px] cursor-default',
              content: 'flex flex-col items-center w-full px-4 py-2',
              title: 'text-[#22c55e] font-bold text-[15px] whitespace-nowrap flex items-center gap-2',
              description: 'text-white/90 text-[14px] text-center overflow-hidden max-h-0 opacity-0 transition-all duration-500 ease-in-out group-hover:max-h-[100px] group-hover:opacity-100 group-hover:mt-3 group-hover:px-2 group-hover:pb-1',
              icon: 'hidden' // We use the title's icon/gap logic or the icons prop
            }
          }} 
        />
      </body>
    </html>
  )
}
