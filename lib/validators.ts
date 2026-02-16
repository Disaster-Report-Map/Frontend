import * as z from 'zod'

export const incidentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  location: z.object({ lat: z.number(), lng: z.number() }),
})

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
export const registerSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) })
