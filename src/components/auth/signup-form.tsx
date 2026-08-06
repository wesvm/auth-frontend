import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { CardFooter } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import useAuth from '@/hooks/use-auth'
import { setFormErrors } from '@/lib/errors'
import { type SignUpSchema, signUpSchema } from '@/lib/validations/auth'

export const SignUpForm = () => {
  const { isRegistering, registerMutation } = useAuth()
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit = (data: SignUpSchema) => {
    registerMutation.mutate(data, {
      onError: (error: any) => setFormErrors(error, form.setError),
    })
  }

  return (
    <ReusableForm form={form} onSubmit={onSubmit} className="gap-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Elon Musk" disabled={isRegistering} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="elonmusk"
                autoComplete="username"
                disabled={isRegistering}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="elonmusk@mail.com"
                disabled={isRegistering}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
                disabled={isRegistering}
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
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isRegistering}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <CardFooter className="flex-col gap-2 p-0">
        <LoadingButton
          type="submit"
          className="w-full"
          isLoading={isRegistering}
          loadingText="Creating account..."
        >
          Create account
        </LoadingButton>

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </ReusableForm>
  )
}
