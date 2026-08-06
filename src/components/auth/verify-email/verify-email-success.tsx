import { Link } from '@tanstack/react-router'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'

export const VerifyEmailSuccess = () => {
  return (
    <AuthCard title="Email verified!" description="Your account has been successfully verified.">
      <p className="text-sm text-muted-foreground text-center leading-relaxed">
        You can now log in to your account and start using all features.
      </p>

      <CardFooter className="p-0 mt-4 border-t pt-4">
        <Button className="w-full" asChild>
          <Link to="/login">Go to Login</Link>
        </Button>
      </CardFooter>
    </AuthCard>
  )
}
