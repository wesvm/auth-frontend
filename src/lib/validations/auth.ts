import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().trim().min(1)
})

export const signUpSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(2),
  email: z.email(),
  password: z.string().min(3),
  password_confirmation: z.string().min(3),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
})

export const enable2faSchema = z.object({
  code: z.string().min(6).max(6)
})

export const disable2faSchema = z.object({
  password: z.string().min(3).optional(),
  code: z.string().min(6).max(6).optional()
})

export const twoFASchema = z.object({
  ticket: z.string().min(1),
  code: z.string().min(6).max(6)
})

export const forgotPasswordSchema = z.object({
  email: z.email().trim()
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(3),
  password_confirmation: z.string().min(3),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
})

export const updatePasswordSchema = z.object({
  current_password: z.string().min(3),
  new_password: z.string().min(3),
  new_password_confirmation: z.string().min(3),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "New passwords do not match",
  path: ["new_password_confirmation"],
}).refine((data) => data.current_password !== data.new_password, {
  message: "New password must be different from current password",
  path: ["new_password"],
})

export type LoginSchema = z.infer<typeof loginSchema>
export type SignUpSchema = z.infer<typeof signUpSchema>
export type TwoFASchema = z.infer<typeof twoFASchema>
export type Enable2FASchema = z.infer<typeof enable2faSchema>
export type Disable2FASchema = z.infer<typeof disable2faSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>