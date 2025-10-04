import { api } from '@/lib/api/client'
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api'
import type { User } from '@/types/models'

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<LoginResponse>('/auth/register', data),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get<User>('/auth/me'),
}

export const usersApi = {
  getAll: () =>
    api.get<User[]>('/users'),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (data: Partial<User>) =>
    api.post<User>('/users', data),

  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
}