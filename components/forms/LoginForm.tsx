'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type Form = z.infer<typeof schema>

export default function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ 
    resolver: zodResolver(schema) 
  })

  const onSubmit = async (data: Form) => {
    setLoading(true)
    try {
      await login(data)
      toast.success("Welcome back!")
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login failed', err)
      const msg = err.response?.data?.error || err.response?.data?.detail || "Login failed. Please check your credentials."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* Email Field */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
        <input 
          type="email"
          {...register('email')} 
          placeholder="Enter your email" 
          disabled={loading}
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors placeholder:text-slate-400 disabled:opacity-50" 
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
            disabled={loading}
            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors placeholder:text-slate-400 pr-10 disabled:opacity-50" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password.message}</div>}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
