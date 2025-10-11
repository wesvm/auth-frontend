import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { ForgotPasswordForm } from '@/components/auth/forgot-pasword-form'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import useAuth from '@/hooks/use-auth'
import type { ForgotPasswordSchema } from '@/lib/validations/auth'

export const Route = createFileRoute('/_auth-layout/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const { forgotPasswordMutation } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setIsSubmitted(true)
        setSubmittedEmail(data.email)
      },
      onError: () => setIsSubmitted(false),
    })
  }

  const handleTryAgain = () => {
    if (submittedEmail) {
      forgotPasswordMutation.mutate({ email: submittedEmail })
    }
  }

  if (isSubmitted) {
    return (
      <AuthCard
        title="Check your email"
        description={`We've sent a password reset link to ${submittedEmail}.`}
        className="grid gap-4"
      >
        <p className="text-muted-foreground text-center">
          Click the link in the email to reset your password. If you don't see it, check your spam
          folder.
        </p>

        <CardFooter className="flex flex-col gap-2 p-0 mt-2 border-t">
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/login">
              <ArrowLeft />
              Back to login
            </Link>
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Didn't receive the email?{' '}
            <Button
              onClick={handleTryAgain}
              variant="link"
              className="p-0 h-auto"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? 'Sending again...' : 'Try again'}
            </Button>
          </div>
        </CardFooter>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm
        onSubmit={onSubmit}
        isForgettingPassword={forgotPasswordMutation.isPending}
      >
        <CardFooter className="flex-col gap-2 p-0 border-t mt-2">
          <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
            {forgotPasswordMutation.isPending ? (
              <>
                <Spinner /> Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <Button variant="ghost" className="w-full" asChild>
            <Link to="/login">
              <ArrowLeft />
              Back to login
            </Link>
          </Button>
        </CardFooter>
      </ForgotPasswordForm>
    </AuthCard>
  )
}
