import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { VerifyEmailError } from '@/components/auth/verify-email/verify-email-error'
import { VerifyEmailLoading } from '@/components/auth/verify-email/verify-email-loading'
import { VerifyEmailPending } from '@/components/auth/verify-email/verify-email-pending'
import { VerifyEmailSuccess } from '@/components/auth/verify-email/verify-email-success'
import { authApi } from '@/lib/api/auth'

export const Route = createFileRoute('/_auth-layout/verify-email')({
  component: VerifyEmail,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
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

  if (!token) return <VerifyEmailPending />
  if (isLoading) return <VerifyEmailLoading />
  if (isError) return <VerifyEmailError />

  return <VerifyEmailSuccess />
}
