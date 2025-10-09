import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle2, Loader2, Mail, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authApi } from '@/lib/api/auth'

export const Route = createFileRoute('/_auth-layout/verify-email')({
  component: VerifyEmail,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
      //email: (search.email as string) || '',
    }
  },
})

function VerifyEmail() {
  const { token } = Route.useSearch()
  const { isLoading, isError } = useQuery({
    queryKey: ['auth', 'verify-email', token],
    queryFn: () =>
      authApi.verifyEmail(token).then((data) => {
        toast.success(data.message)
        return data
      }),
    enabled: !!token,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  if (!token) {
    return (
      <Card>
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="size-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-serif tracking-tight text-balance">
              Check your email
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Please check your email and click the verification link to activate your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We've sent a verification link to your email address. Click the link to complete your
            registration and start using your account.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <Button variant="outline" className="w-full h-11 bg-transparent" asChild>
            <Link to="/login">Return to login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-serif tracking-tight text-balance">
              Verifying your email
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Please wait while we verify your account...
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <XCircle className="size-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-serif tracking-tight text-balance">
              Verification failed
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              We couldn't verify your email address.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The verification link may be invalid or expired. Please try registering again or contact
            support.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 border-t pt-6">
          <Button variant="outline" className="w-full h-11 bg-transparent" asChild>
            <Link to="/sign-up">Register again</Link>
          </Button>
          <Button variant="ghost" className="w-full h-11" asChild>
            <Link to="/login">Return to login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="space-y-4 pb-4">
        <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="size-8 text-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-serif tracking-tight text-balance">
            Email verified!
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Your account has been successfully verified.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          You can now log in to your account and start using all features.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-6">
        <Button className="w-full h-11" asChild>
          <Link to="/login">Go to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
