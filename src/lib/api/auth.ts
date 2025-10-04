import { api } from '@/lib/api/client'
import type { LoginSchema } from '@/lib/validations/auth'
import type { LoginResponse } from '@/types/api'
import type { User } from '@/types/models'

export const authApi = {
  login: (data: LoginSchema) =>
    api.post<LoginResponse>('/auth/login', data),

  //register: (data: RegisterSchema) => api.post<RegisterResponse>('/auth/register', data),

  logout: () =>
    api.post<void>('/auth/logout'),

  me: () =>
    api.get<User>('/auth/me'),
}
