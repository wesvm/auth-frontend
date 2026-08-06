import { Link } from '@tanstack/react-router'
import { XCircle } from 'lucide-react'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'

export const VerifyEmailError = () => {
  return (
    <AuthCard
      title="Verification failed"
      description="We couldn't verify your email address."
      icon={<XCircle className="size-8 text-destructive" />}
    >
      <p className="text-sm text-muted-foreground text-center leading-relaxed">
        The verification link may be invalid or expired. Please try registering again or contact
        support.
      </p>

      <CardFooter className="flex flex-col gap-2 p-0 mt-4 border-t pt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/sign-up">Register again</Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link to="/login">Return to login</Link>
        </Button>
      </CardFooter>
    </AuthCard>
  )
}
