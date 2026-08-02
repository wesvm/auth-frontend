import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api/auth'
import { setFormErrors } from '@/lib/errors'
import { type UpdatePasswordSchema, updatePasswordSchema } from '@/lib/validations/auth'

export const PasswordSettings = () => {
  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  })

  const { mutate: updatePassword, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdatePasswordSchema) => authApi.updatePassword(data),
    onSuccess: () => {
      toast.success('Password updated successfully')
      form.reset()
    },
    onError: (error: any) => {
      setFormErrors(error, form.setError)
    },
  })

  const onSubmit = (data: UpdatePasswordSchema) => {
    updatePassword(data)
  }

  return (
    <ReusableForm form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="current_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isUpdating}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="new_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isUpdating}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="new_password_confirmation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm New Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isUpdating}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" disabled={isUpdating}>
        {isUpdating && <Loader2 className="mr-2 size-4 animate-spin" />}
        Update Password
      </Button>
    </ReusableForm>
  )
}
