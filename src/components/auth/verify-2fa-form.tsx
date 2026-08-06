import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useForm } from 'react-hook-form'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { LoadingButton } from '@/components/ui/loading-button'
import useAuth from '@/hooks/use-auth'
import { authService } from '@/lib/api/auth'
import { type TwoFASchema, twoFASchema } from '@/lib/validations/auth'

interface VerifyTwoFactorFormProps {
  ticket: string
}

export const VerifyTwoFactorForm = ({ ticket }: VerifyTwoFactorFormProps) => {
  const navigate = useNavigate()
  const { verify2FA, isVerifying2FA } = useAuth()

  const form = useForm<TwoFASchema>({
    resolver: zodResolver(twoFASchema),
    defaultValues: {
      ticket,
      code: '',
    },
  })

  const handleCancel = () => {
    authService.clear2FATicket()
    navigate({ to: '/login' })
  }

  return (
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

      <CardFooter className="flex-col gap-2 p-0 border-t mt-2">
        <LoadingButton
          type="submit"
          className="w-full"
          isLoading={isVerifying2FA}
          loadingText="Verifying..."
        >
          Verify
        </LoadingButton>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="w-full"
          disabled={isVerifying2FA}
        >
          Cancel
        </Button>
      </CardFooter>
    </ReusableForm>
  )
}
