import '. /styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'Disaster Report Map',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  )
}
