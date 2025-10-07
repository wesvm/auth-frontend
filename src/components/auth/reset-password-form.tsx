import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ResetPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'

interface Props {
  onSubmit: (data: ResetPasswordSchema) => void
  isResettingPassword: boolean
  token: string
}

export const ResetPasswordForm = ({ onSubmit, isResettingPassword, token }: Props) => {
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      password_confirmation: '',
    },
  })

  return (
    <ReusableForm form={form} onSubmit={onSubmit} className="gap-5">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isResettingPassword}
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
            <FormLabel>Password Confirmation</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isResettingPassword}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={isResettingPassword}>
        {isResettingPassword ? 'Resetting...' : 'Reset Password'}
      </Button>
    </ReusableForm>
  )
}
