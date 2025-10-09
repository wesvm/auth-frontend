import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import useAuth from '@/hooks/use-auth'
import { authService } from '@/lib/api/auth'
import { type TwoFASchema, twoFASchema } from '@/lib/validations/auth'

export const Route = createFileRoute('/_auth-layout/verify-2fa')({
  component: VerifyTwoFactor,
  beforeLoad: async () => {
    const ticket = authService.get2FATicket()
    if (!ticket) {
      throw redirect({
        to: '/login',
      })
    }
    return { ticket }
  },
})

function VerifyTwoFactor() {
  const navigate = useNavigate()
  const { ticket } = Route.useRouteContext()
  const { verify2FA, isVerifying2FA } = useAuth()

  const form = useForm<TwoFASchema>({
    resolver: zodResolver(twoFASchema),
    defaultValues: {
      ticket: ticket,
      code: '',
    },
  })

  const handleCancel = () => {
    authService.clear2FATicket()
    navigate({ to: '/login' })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Shield className="size-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">Two-Factor Authentication</CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReusableForm form={form} onSubmit={verify2FA}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-y-2 flex-col">
            <Button type="submit" className="flex-1" disabled={isVerifying2FA}>
              {isVerifying2FA ? 'Verifying...' : 'Verify'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isVerifying2FA}
            >
              Cancel
            </Button>
          </div>
        </ReusableForm>
      </CardContent>
    </Card>
  )
}
