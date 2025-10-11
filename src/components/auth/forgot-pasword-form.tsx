import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ForgotPasswordSchema, forgotPasswordSchema } from '@/lib/validations/auth'

interface Props {
  onSubmit: (data: ForgotPasswordSchema) => void
  isForgettingPassword: boolean
  children?: React.ReactNode
}

export const ForgotPasswordForm = ({ onSubmit, isForgettingPassword, children }: Props) => {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

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
                disabled={isForgettingPassword}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {children}
    </ReusableForm>
  )
}
