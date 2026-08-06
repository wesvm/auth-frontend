import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ForgotPasswordForm } from '@/components/auth/forgot-password/forgot-password-form'
import { ForgotPasswordSuccess } from '@/components/auth/forgot-password/forgot-password-success'
import { AuthCard } from '@/components/auth/shared/auth-card'

export const Route = createFileRoute('/_auth-layout/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  if (submittedEmail) {
    return <ForgotPasswordSuccess email={submittedEmail} onReset={() => setSubmittedEmail(null)} />
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm onSuccess={(email) => setSubmittedEmail(email)} />
    </AuthCard>
  )
}
