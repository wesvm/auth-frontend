import { Link } from '@tanstack/react-router'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'

export const ResetPasswordInvalid = () => {
  return (
    <AuthCard
      title="Invalid reset link"
      description="This password reset link is invalid or has expired"
    >
      <CardFooter className="p-0 border-t pt-4">
        <Button className="w-full" asChild>
          <Link to="/forgot-password">Request new link</Link>
        </Button>
      </CardFooter>
    </AuthCard>
  )
}
