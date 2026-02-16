'use client'
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }

export default function Button({ children, className = '', ...rest }: Props) {
  return (
    <button className={`px-3 py-2 rounded bg-blue-600 text-white ${className}`} {...rest}>{children}</button>
  )
}
