import { createFileRoute, redirect } from '@tanstack/react-router'
import { Shield } from 'lucide-react'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { VerifyTwoFactorForm } from '@/components/auth/verify-2fa-form'
import { authService } from '@/lib/api/auth'

export const Route = createFileRoute('/_auth-layout/verify-2fa')({
  component: VerifyTwoFactor,
  beforeLoad: async () => {
    const ticket = authService.get2FATicket()
    if (!ticket) {
      throw redirect({
        to: '/login',
      })
    }
    return { ticket }
  },
})

function VerifyTwoFactor() {
  const { ticket } = Route.useRouteContext()

  return (
    <AuthCard
      title="Two-Factor Authentication"
      description="Enter the 6-digit code from your authenticator app"
      icon={<Shield className="size-8" />}
    >
      <VerifyTwoFactorForm ticket={ticket} />
    </AuthCard>
  )
}
