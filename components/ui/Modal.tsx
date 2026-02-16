'use client'
import React from 'react'

type Props = { open: boolean; onClose: () => void; children: React.ReactNode }

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 rounded-t-lg md:rounded-lg p-4">
        <button className="absolute right-3 top-3" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}
