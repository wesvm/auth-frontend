import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().min(1, 'Username or Email is required').trim(),
  password: z.string().min(1, 'Password is required').trim(),
})

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim(),
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed')
      .trim()
      .transform((val) => val.toLowerCase()),
    email: z.email('Invalid email address').min(1, 'Email is required').trim().toLowerCase(),
    password: z
      .string()
      .min(3, 'Password must be at least 3 characters')
      .max(100, 'Password must not exceed 100 characters')
      .trim(),
    password_confirmation: z.string().min(1, 'Password confirmation is required').trim(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export const twoFASchema = z.object({
  ticket: z.string().min(1, 'Ticket is required').trim(),
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
})

export const enable2faSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
})

export const disable2faSchema = z
  .object({
    password: z.string().min(3, 'Password must be at least 3 characters').optional(),
    code: z
      .string()
      .length(6, 'Code must be exactly 6 digits')
      .regex(/^\d{6}$/, 'Code must contain only numbers')
      .optional(),
  })
  .refine((data) => data.password || data.code, {
    message: 'Either password or 2FA code is required',
    path: ['password'],
  })

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required').trim().toLowerCase(),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required').trim(),
    password: z
      .string()
      .min(3, 'Password must be at least 3 characters')
      .max(100, 'Password must not exceed 100 characters')
      .trim(),
    password_confirmation: z.string().min(1, 'Password confirmation is required').trim(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required').trim(),
    new_password: z
      .string()
      .min(3, 'Password must be at least 3 characters')
      .max(100, 'Password must not exceed 100 characters')
      .trim(),
    new_password_confirmation: z.string().min(1, 'Password confirmation is required').trim(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: 'New passwords do not match',
    path: ['new_password_confirmation'],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: 'New password must be different from current password',
    path: ['new_password'],
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type SignUpSchema = z.infer<typeof signUpSchema>
export type TwoFASchema = z.infer<typeof twoFASchema>
export type Enable2FASchema = z.infer<typeof enable2faSchema>
export type Disable2FASchema = z.infer<typeof disable2faSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>
