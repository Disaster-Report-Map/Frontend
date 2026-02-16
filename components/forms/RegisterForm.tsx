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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register('name')} placeholder="Name" className="w-full border p-2 rounded" />
      <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded" />
      <input type="password" {...register('password')} placeholder="Password" className="w-full border p-2 rounded" />
      <button type="submit" className="w-full px-3 py-2 bg-green-600 text-white rounded">Create account</button>
    </form>
  )
}
