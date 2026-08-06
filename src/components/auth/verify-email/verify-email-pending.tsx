import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'

export const VerifyEmailPending = () => {
  return (
    <AuthCard
      title="Check your email"
      description="Please check your email and click the verification link to activate your account."
      icon={<Mail className="size-8" />}
    >
      <p className="text-sm text-muted-foreground text-center leading-relaxed">
        We've sent a verification link to your email address. Click the link to complete your
        registration and start using your account.
      </p>

      <CardFooter className="p-0 mt-4 border-t pt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/login">Return to login</Link>
        </Button>
      </CardFooter>
    </AuthCard>
  )
}
