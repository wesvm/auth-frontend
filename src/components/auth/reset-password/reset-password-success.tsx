import { Link } from '@tanstack/react-router'
import { AuthCard } from '@/components/auth/shared/auth-card'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'

export const ResetPasswordSuccess = () => {
  return (
    <AuthCard
      title="Password reset successfully"
      description="Your password has been changed. You can now log in with your new password"
    >
      <CardFooter className="p-0 border-t pt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/login">Return to login</Link>
        </Button>
      </CardFooter>
    </AuthCard>
  )
}
