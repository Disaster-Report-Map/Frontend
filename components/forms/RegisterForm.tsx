'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2, User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["citizen", "organization"])
})

type Form = z.infer<typeof schema>

export default function RegisterForm() {
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ 
    resolver: zodResolver(schema),
    defaultValues: { role: 'citizen' }
  })

  const onSubmit = async (data: Form) => {
    setLoading(true)
    setServerError(null)
    try {
      await registerUser(data)
      toast.success("Account created successfully!")
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Registration failed', err)
      const data = err.response?.data
      let msg = "Registration failed."
      
      if (data) {
        // Handle validation error objects from Django
        const errorEntries = Object.entries(data)
        if (errorEntries.length > 0) {
          const [field, error] = errorEntries[0]
          msg = Array.isArray(error) ? `${field}: ${error[0]}` : String(error)
        }
      }
      
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      {serverError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
          {serverError}
        </div>
      )}

      {/* Username Field */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <UserIcon className="w-4 h-4" /> Username
        </label>
        <input 
          type="text"
          {...register('username')} 
          placeholder="e.g. johndoe" 
          disabled={loading}
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50" 
        />
        {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username.message}</div>}
      </div>

      {/* Email Field */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Mail className="w-4 h-4" /> Email Address
        </label>
        <input 
          type="email"
          {...register('email')} 
          placeholder="Enter your email" 
          disabled={loading}
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50" 
        />
        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email.message}</div>}
      </div>

      {/* Role Selection */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Account Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <select 
            {...register('role')}
            disabled={loading}
            className="col-span-2 w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
          >
            <option value="citizen">Citizen</option>
            <option value="organization">Organization</option>
          </select>
        </div>
        {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role.message}</div>}
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Password
        </label>
        <input 
          type="password" 
          {...register('password')} 
          placeholder="Create a password" 
          disabled={loading}
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50" 
        />
        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password.message}</div>}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
