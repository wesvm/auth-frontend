import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useAuth from '@/hooks/use-auth'
import { type LoginSchema, loginSchema } from '@/lib/validations/auth'

export const LoginForm = () => {
  const { login, isLoggingIn } = useAuth()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  })

  return (
    <ReusableForm form={form} onSubmit={login} className="gap-5">
      <FormField
        control={form.control}
        name="login"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="elon"
                autoComplete="username"
                disabled={isLoggingIn}
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
          <FormItem className="flex flex-col-reverse">
            <FormMessage />
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoggingIn}
                {...field}
              />
            </FormControl>
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </Button>

      <div className="flex flex-col border-t">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-foreground hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </ReusableForm>
  )
}
