'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../hooks/useAuth'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type Form = z.infer<typeof schema>

export default function LoginForm() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => { await login(data) }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* Email Field */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
        <input 
          type="email"
          {...register('email')} 
          placeholder="Enter your email" 
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors placeholder:text-slate-400" 
        />
        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email.message}</div>}
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Forgot password?
          </Link>
        </div>
        
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            {...register('password')} 
            placeholder="Enter your password" 
            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors placeholder:text-slate-400 pr-10" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            {showPassword ? (
               // Eye Open SVG
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              // Eye Closed (Crossed out) SVG
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password.message}</div>}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full px-4 py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        Sign in
      </button>
    </form>
  )
}
