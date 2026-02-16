'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type Form = z.infer<typeof schema>

export default function LoginForm() {
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => { await login(data) }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded" />
        {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
      </div>
      <div>
        <input type="password" {...register('password')} placeholder="Password" className="w-full border p-2 rounded" />
        {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
      </div>
      <button type="submit" className="w-full px-3 py-2 bg-blue-600 text-white rounded">Sign in</button>
    </form>
  )
}
