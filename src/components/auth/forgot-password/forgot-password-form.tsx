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
import { type ForgotPasswordSchema, forgotPasswordSchema } from '@/lib/validations/auth'

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const { forgotPasswordMutation } = useAuth()

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        onSuccess(data.email)
      },
      onError: (error: any) => {
        setFormErrors(error, form.setError)
      },
    })
  }

  return (
    <ReusableForm form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="elon@mail.com"
                autoComplete="email"
                disabled={forgotPasswordMutation.isPending}
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
          isLoading={forgotPasswordMutation.isPending}
          loadingText="Sending..."
        >
          Send reset link
        </LoadingButton>

        <Button variant="ghost" className="w-full" asChild>
          <Link to="/login">
            <ArrowLeft />
            Back to login
          </Link>
        </Button>
      </CardFooter>
    </ReusableForm>
  )
}
