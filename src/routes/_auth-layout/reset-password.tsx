import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
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
import type { ResetPasswordSchema } from '@/lib/validations/auth'

export const Route = createFileRoute('/_auth-layout/reset-password')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    }
  },
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const { resetPasswordMutation } = useAuth()
  const [isReset, setIsReset] = useState<boolean>(false)

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => setIsReset(true),
    })
  }

  if (!token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif tracking-tight text-balance">
            Invalid reset link
          </CardTitle>
          <CardDescription className="text-base">
            This password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t">
          <Link to="/forgot-password" className="w-full">
            <Button className="w-full">Request new link</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (isReset) {
    return (
      <Card>
        <CardHeader>
          <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="size-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-serif tracking-tight text-balance">
            Password reset successfully
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Your password has been changed. You can now log in with your new password
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Return to login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-serif tracking-tight text-balance">
          Create new password
        </CardTitle>
        <CardDescription className="text-base">
          Enter a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm
          token={token}
          onSubmit={onSubmit}
          isResettingPassword={resetPasswordMutation.isPending}
        />
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/login">Return to login</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
