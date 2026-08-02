import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Check, Copy, KeyRound, Loader2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { authApi } from '@/lib/api/auth'
import { setFormErrors } from '@/lib/errors'
import { type Enable2FASchema, enable2faSchema } from '@/lib/validations/auth'
import type { TwoFAQrCodeResponse } from '@/types/api'

interface TFASetupWizardProps {
  qrData: TwoFAQrCodeResponse
  onSuccess: () => void
  onRegenerate: () => void
  onCancel: () => void
  isRegenerating: boolean
}

export const TFASetupWizard = ({
  qrData,
  onSuccess,
  onRegenerate,
  onCancel,
  isRegenerating,
}: TFASetupWizardProps) => {
  const [copied, setCopied] = useState(false)

  const enableForm = useForm<Enable2FASchema>({
    resolver: zodResolver(enable2faSchema),
    defaultValues: { code: '' },
  })

  const enable2FA = useMutation({
    mutationFn: authApi.enable2fa,
    onSuccess: () => {
      enableForm.reset()
      toast.success('Two-factor authentication has been enabled!')
      onSuccess()
    },
    onError: (error: any) => {
      setFormErrors(error, enableForm.setError)
    },
  })

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    toast.success('Secret key copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Step 1: Scan QR Code</h4>

        <div className="flex flex-col items-center justify-center p-6 rounded-xl border">
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(qrData.qr_code)}`}
            alt="2FA QR Code"
            className="size-52 object-contain"
          />
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Scan this QR code with Google Authenticator, Authy, or 1Password.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Can't scan? Enter key manually</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 gap-2">
          <code className="text-sm font-mono break-all select-all">{qrData.secret}</code>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 shrink-0"
            onClick={() => handleCopySecret(qrData.secret)}
          >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
            <span className="sr-only">Copy key</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t">
        <h4 className="font-medium text-sm">Step 2: Verify 6-Digit Code</h4>
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code displayed in your authenticator app to complete setup.
        </p>

        <ReusableForm form={enableForm} onSubmit={(data) => enable2FA.mutate(data)}>
          <FormField
            control={enableForm.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-3 flex flex-col items-center justify-center">
                <FormLabel className="sr-only">Verification Code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={enable2FA.isPending}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-2" />
                    <InputOTPGroup>
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

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={enable2FA.isPending}>
              {enable2FA.isPending && <Loader2 className=" size-4 animate-spin" />}
              Enable 2FA
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onRegenerate}
              disabled={isRegenerating || enable2FA.isPending}
            >
              {isRegenerating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Regenerate QR
            </Button>

            <Button type="button" variant="ghost" onClick={onCancel} disabled={enable2FA.isPending}>
              Cancel
            </Button>
          </div>
        </ReusableForm>
      </div>
    </div>
  )
}
