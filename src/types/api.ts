import type { User } from "@/types/models"

export interface ApiResponse<T = any> {
  status?: number
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  account: User
  access_token: string
  token_type: string
  expires_in: number
}

export interface Login2faResponse {
  ticket: string
  token_type: string
  expires_in: number
}

export interface RegisterRequest {
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
}

export interface TwoFAQrCodeResponse {
  secret: string
  qr_code: string
  notice: string
}