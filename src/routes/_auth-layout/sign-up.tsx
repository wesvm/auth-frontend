import { createFileRoute } from '@tanstack/react-router'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { SignUpForm } from '@/components/auth/signup-form'

export const Route = createFileRoute('/_auth-layout/sign-up')({
  component: SignUp,
})

function SignUp() {
  return (
    <AuthCard title="Create an account" description="Enter your information to get started">
      <SignUpForm />
    </AuthCard>
  )
}
