'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useIncidents } from '../../hooks/useIncidents'

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  location: z.object({ lat: z.number(), lng: z.number() }),
})

type Form = z.infer<typeof schema>

export default function ReportIncidentForm({ onDone }: { onDone?: () => void }) {
  const { addIncident } = useIncidents()
  const { register, handleSubmit } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => {
    await addIncident({ ...data, status: 'pending' })
    onDone?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register('title')} placeholder="Title" className="w-full border p-2 rounded" />
      <textarea {...register('description')} placeholder="Description" className="w-full border p-2 rounded" />
      <input {...register('category')} placeholder="Category" className="w-full border p-2 rounded" />
      <div className="flex gap-2">
        <input {...register('location.lat', { valueAsNumber: true })} placeholder="Lat" className="w-1/2 border p-2 rounded" />
        <input {...register('location.lng', { valueAsNumber: true })} placeholder="Lng" className="w-1/2 border p-2 rounded" />
      </div>
      <button type="submit" className="px-3 py-2 bg-orange-500 text-white rounded">Report</button>
    </form>
  )
}
