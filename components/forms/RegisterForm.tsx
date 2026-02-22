'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

type Form = z.infer<typeof schema>

export default function RegisterForm() {
  const { register: registerUser } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: Form) => { await registerUser(data) }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* Name Field */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
        <input 
          type="text"
          {...register('name')} 
          placeholder="Enter your full name" 
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors placeholder:text-slate-400" 
        />
        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>}
      </div>

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
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
        <input 
          type="password" 
          {...register('password')} 
          placeholder="Create a password" 
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors placeholder:text-slate-400" 
        />
        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password.message}</div>}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full px-4 py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        Create Account
      </button>
    </form>
  )
}
