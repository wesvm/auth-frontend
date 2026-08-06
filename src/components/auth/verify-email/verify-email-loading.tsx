import { Loader2 } from 'lucide-react'
import { AuthCard } from '@/components/auth/shared/auth-card'

export const VerifyEmailLoading = () => {
  return (
    <AuthCard
      title="Verifying your email"
      description="Please wait while we verify your account..."
      icon={<Loader2 className="size-8 animate-spin" />}
    >
      <p className="text-sm text-muted-foreground text-center">This may take a few moments.</p>
    </AuthCard>
  )
}
