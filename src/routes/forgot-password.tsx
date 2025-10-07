import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { ForgotPasswordForm } from '@/components/auth/forgot-pasword-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useAuth from '@/hooks/use-auth'
import type { ForgotPasswordSchema } from '@/lib/validations/auth'

export const Route = createFileRoute('/forgot-password')({
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
      <div className="flex min-h-svh items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-serif tracking-tight text-balance">
              Check your email
            </CardTitle>
            <CardDescription className="text-base">
              We've sent a password reset link to {submittedEmail}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Click the link in the email to reset your password. If you don't see it, check your
              spam folder.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t">
            <Link to="/login" className="w-full">
              <Button variant="ghost" className="w-full h-11">
                <ArrowLeft className="size-4" />
                Back to login
              </Button>
            </Link>
            <div className="text-sm text-center text-muted-foreground">
              Didn't receive the email?{' '}
              <Button
                onClick={handleTryAgain}
                variant="link"
                className="p-0"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? 'Sending again...' : 'Try again'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-serif tracking-tight text-balance">
            Reset your password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm
            onSubmit={onSubmit}
            isForgettingPassword={forgotPasswordMutation.isPending}
          />
        </CardContent>
        <CardFooter className="border-t">
          <Link to="/login" className="w-full">
            <Button variant="ghost" className="w-full h-11">
              <ArrowLeft className="size-4" />
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
