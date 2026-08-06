import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import useAuth from '@/hooks/use-auth'
import { setFormErrors } from '@/lib/errors'
import { type ResetPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'

interface ResetPasswordFormProps {
  token: string
  onSuccess: () => void
}

export const ResetPasswordForm = ({ token, onSuccess }: ResetPasswordFormProps) => {
  const { resetPasswordMutation } = useAuth()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        onSuccess()
      },
      onError: (error: any) => {
        setFormErrors(error, form.setError)
      },
    })
  }

  return (
    <ReusableForm form={form} onSubmit={onSubmit} className="gap-5">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={resetPasswordMutation.isPending}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password_confirmation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm New Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={resetPasswordMutation.isPending}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <CardFooter className="flex-col gap-2 p-0 border-t mt-2">
        <LoadingButton
          type="submit"
          className="w-full"
          isLoading={resetPasswordMutation.isPending}
          loadingText="Resetting..."
        >
          Reset Password
        </LoadingButton>

        <Button variant="ghost" className="w-full" asChild>
          <Link to="/login">
            <ArrowLeft />
            Return to login
          </Link>
        </Button>
      </CardFooter>
    </ReusableForm>
  )
}
