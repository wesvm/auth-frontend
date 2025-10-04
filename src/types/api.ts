import type { User } from "@/types/models"

export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface RegisterRequest {
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
}