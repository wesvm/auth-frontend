import { api } from '@/lib/api/client'
import type { User } from '@/types/models'

export const usersApi = {
  getAll: () => 
    api.get<User[]>('/users'),

  getById: (id: string) => 
    api.get<User>(`/users/${id}`),

  create: (data: Partial<User>) => 
    api.post<User>('/users', data),

  update: (id: string, data: Partial<User>) => 
    api.patch<{ user: User }>(`/users/${id}`, data),

  delete: (id: string) => 
    api.delete(`/users/${id}`),
}
