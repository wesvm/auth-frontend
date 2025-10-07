import { api } from '@/lib/api/client'
import type { Disable2FASchema, Enable2FASchema, ForgotPasswordSchema, LoginSchema, ResetPasswordSchema, SignUpSchema, TwoFASchema, UpdatePasswordSchema } from '@/lib/validations/auth'
import type { ApiResponse, Login2faResponse, LoginResponse, TwoFAQrCodeResponse } from '@/types/api'
import type { User } from '@/types/models'

export const authApi = {
  login: (data: LoginSchema) =>
    api.post<LoginResponse | Login2faResponse>('/auth/login', data),

  register: (data: SignUpSchema) =>
    api.post<ApiResponse>('/auth/register', data),

  logout: () =>
    api.post<ApiResponse>('/auth/logout'),

  me: () =>
    api.get<User>('/auth/me'),

  forgotPassword: (data: ForgotPasswordSchema) =>
    api.post<ApiResponse>('/auth/password/forgot', data),

  resetPassword: (data: ResetPasswordSchema) =>
    api.post<ApiResponse>('/auth/password/reset', data),

  updatePassword: (data: UpdatePasswordSchema) =>
    api.post<ApiResponse>('/auth/password/update', data),

  verifyEmail: (token: string) =>
    api.get<ApiResponse>(`/auth/verify-email/${token}`),

  resendVerificationEmail: (email: string) =>
    api.post<ApiResponse>('/auth/resend-verification', { email }),

  verify2fa: (data: TwoFASchema) =>
    api.post<LoginResponse>('/auth/2fa/verify', data),

  generate2fa: () =>
    api.post<TwoFAQrCodeResponse>('/auth/2fa/generate'),

  enable2fa: (data: Enable2FASchema) =>
    api.post<ApiResponse>('/auth/2fa/enable', data),

  disable2fa: (data: Disable2FASchema) =>
    api.post<ApiResponse>('/auth/2fa/disable', data),
}

export const authService = {
  setToken: (token: string) => {
    localStorage.setItem('access_token', token)
  },

  getToken: () => {
    return localStorage.getItem('access_token')
  },

  clearToken: () => {
    localStorage.removeItem('access_token')
  },

  set2FATicket: (ticket: string) => {
    const data = {
      ticket,
      expiresAt: Date.now() + 5 * 60 * 1000
    }
    localStorage.setItem('2fa_ticket', JSON.stringify(data))
  },

  get2FATicket: () => {
    const data = localStorage.getItem('2fa_ticket')
    if (!data) return null

    try {
      const parsed = JSON.parse(data)
      if (Date.now() > parsed.expiresAt) {
        authService.clear2FATicket()
        return null
      }
      return parsed.ticket
    } catch {
      return null
    }
  },

  clear2FATicket: () => {
    localStorage.removeItem('2fa_ticket')
  },

  clearAll: () => {
    authService.clearToken()
    authService.clear2FATicket()
  }
}