export type Role = 'user' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  profileImageUrl?: string
}

