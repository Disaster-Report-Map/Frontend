import React from 'react'
import { cookies } from 'next/headers'

// Stripped of local headers/footers to inherit the global app/layout.tsx wrapper
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full h-full relative flex flex-col">
      {children}
    </div>
  )
}
