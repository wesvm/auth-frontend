import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/login-form'
import { AuthCard } from '@/components/auth/shared/auth-card'

export const Route = createFileRoute('/_auth-layout/login')({
  component: Login,
})

function Login() {
  return (
    <AuthCard
      title="Login to your account"
      description="Enter your credentials to access your account."
    >
      <LoginForm />
    </AuthCard>
  )
}
