import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ResetPasswordForm } from '@/components/auth/reset-password/reset-password-form'
import { ResetPasswordInvalid } from '@/components/auth/reset-password/reset-password-invalid'
import { ResetPasswordSuccess } from '@/components/auth/reset-password/reset-password-success'
import { AuthCard } from '@/components/auth/shared/auth-card'

export const Route = createFileRoute('/_auth-layout/reset-password')({
  component: ResetPassword,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    }
  },
})

function ResetPassword() {
  const { token } = Route.useSearch()
  const [isResetSuccess, setIsResetSuccess] = useState<boolean>(false)

  if (!token) {
    return <ResetPasswordInvalid />
  }

  if (isResetSuccess) {
    return <ResetPasswordSuccess />
  }

  return (
    <AuthCard title="Create new password" description="Enter a new password for your account">
      <ResetPasswordForm token={token} onSuccess={() => setIsResetSuccess(true)} />
    </AuthCard>
  )
}
