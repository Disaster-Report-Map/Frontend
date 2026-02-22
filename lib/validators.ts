import * as z from 'zod'

export const incidentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  location: z.object({ lat: z.number(), lng: z.number() }),
})

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
export const registerSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) })

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  profileImageUrl: z.string().optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

