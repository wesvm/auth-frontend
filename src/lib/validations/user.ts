import type { z } from 'zod'
import { signUpSchema } from './auth'

export const updateUserSchema = signUpSchema.partial()
export type UpdateUserSchema = z.infer<typeof updateUserSchema>
