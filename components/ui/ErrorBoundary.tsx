'use client'
import React from 'react'

type Props = { children: React.ReactNode }

export default function ErrorBoundary({ children }: Props) {
  // Minimal client-side wrapper - in production use react-error-boundary
  return <>{children}</>
}
