import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api/auth'
import { type Enable2FASchema, enable2faSchema } from '@/lib/validations/auth'
import type { TwoFAQrCodeResponse } from '@/types/api'

export const TwoFaSettings = () => {
  const [qrData, setQrData] = useState<TwoFAQrCodeResponse | null>(null)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const form = useForm<Enable2FASchema>({
    resolver: zodResolver(enable2faSchema),
    defaultValues: {
      code: '',
    },
  })

  const generate2FA = useMutation({
    mutationFn: authApi.generate2fa,
    onSuccess: (data) => {
      setQrData(data)

      toast.success('QR Code generated successfully')
    },
  })

  const enable2FA = useMutation({
    mutationFn: authApi.enable2fa,
    onSuccess: () => {
      setIs2FAEnabled(true)
      toast.success('2FA enabled successfully!')
      form.reset()
    },
    onError: () => {
      toast.error('Invalid code. Please try again.')
    },
  })

  const handleGenerate = () => {
    generate2FA.mutate()
  }

  const handleEnable2FA = (data: Enable2FASchema) => {
    enable2FA.mutate(data)
  }

  if (is2FAEnabled) {
    return <div className="p-2">Two-Factor Authentication is enabled on your account.</div>
  }

  return (
    <>
      {!qrData ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication adds an extra layer of security to your account. You'll need
            to enter a code from your phone in addition to your password.
          </p>
          <Button onClick={handleGenerate} disabled={generate2FA.isPending}>
            {generate2FA.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Setup 2FA
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Step 1: Scan QR Code</h3>
            <div className="flex justify-center p-4 bg-white rounded-lg border">
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(qrData.qr_code)}`}
                alt="2FA QR Code"
                className="w-64 h-64"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Or enter this code manually:</h3>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm break-all font-mono">{qrData.secret}</code>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Step 2: Enter verification code</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the 6-digit code from your authenticator app
            </p>

            <ReusableForm form={form} onSubmit={handleEnable2FA}>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        maxLength={6}
                        disabled={enable2FA.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={enable2FA.isPending}>
                  {enable2FA.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enable 2FA
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={generate2FA.isPending}
                >
                  Regenerate QR
                </Button>
              </div>
            </ReusableForm>
          </div>
        </div>
      )}
    </>
  )
}
