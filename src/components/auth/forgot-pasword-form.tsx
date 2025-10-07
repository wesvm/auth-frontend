import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ForgotPasswordSchema, forgotPasswordSchema } from '@/lib/validations/auth'

interface Props {
  onSubmit: (data: ForgotPasswordSchema) => void
  isForgettingPassword: boolean
}

export const ForgotPasswordForm = ({ onSubmit, isForgettingPassword }: Props) => {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  return (
    <ReusableForm form={form} onSubmit={onSubmit} className="gap-5">
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
                disabled={isForgettingPassword}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={isForgettingPassword}>
        {isForgettingPassword ? 'Sending...' : 'Send reset link'}
      </Button>
    </ReusableForm>
  )
}
