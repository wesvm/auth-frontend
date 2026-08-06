import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import useAuth from '@/hooks/use-auth'

interface ForgotPasswordSuccessProps {
  email: string
  onReset: () => void
}

export const ForgotPasswordSuccess = ({ email, onReset }: ForgotPasswordSuccessProps) => {
  const { forgotPasswordMutation } = useAuth()

  const handleResend = () => {
    forgotPasswordMutation.mutate({ email })
  }

  return (
    <AuthCard
      title="Check your email"
      description={`We've sent a password reset link to ${email}.`}
      className="grid gap-4"
    >
      <p className="text-muted-foreground text-center text-sm">
        Click the link in the email to reset your password. If you don't see it, check your spam
        folder.
      </p>

      <CardFooter className="flex flex-col gap-2 p-0 mt-2 border-t">
        <Button variant="ghost" className="w-full" onClick={onReset} asChild>
          <Link to="/login">
            <ArrowLeft />
            Back to login
          </Link>
        </Button>

        <div className="text-sm text-center text-muted-foreground">
          Didn't receive the email?{' '}
          <Button
            onClick={handleResend}
            variant="link"
            className="p-0 h-auto font-normal text-primary hover:underline"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? 'Sending again...' : 'Try again'}
          </Button>
        </div>
      </CardFooter>
    </AuthCard>
  )
}
