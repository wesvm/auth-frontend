import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Key, Loader2, ShieldCheck, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ReusableForm } from '@/components/reusable-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authApi } from '@/lib/api/auth'
import { setFormErrors } from '@/lib/errors'
import { type Disable2FASchema, disable2faSchema } from '@/lib/validations/auth'

interface TFAActiveCardProps {
  onDisabledSuccess: () => void
}

export const TFAActiveCard = ({ onDisabledSuccess }: TFAActiveCardProps) => {
  const [isDisabling, setIsDisabling] = useState(false)
  const [method, setMethod] = useState<'code' | 'password'>('code')

  const disableForm = useForm<Disable2FASchema>({
    resolver: zodResolver(disable2faSchema),
  })

  const disable2FA = useMutation({
    mutationFn: authApi.disable2fa,
    onSuccess: () => {
      setIsDisabling(false)
      disableForm.reset()
      toast.success('Two-factor authentication disabled successfully')
      onDisabledSuccess()
    },
    onError: (error: any) => {
      setFormErrors(error, disableForm.setError)
    },
  })

  const handleMethodChange = (value: string) => {
    setMethod(value as 'code' | 'password')
    disableForm.reset()
  }

  const onSubmit = (data: Disable2FASchema) => {
    const payload: Disable2FASchema = {}
    if (method === 'code' && data.code) {
      payload.code = data.code
    } else if (method === 'password' && data.password) {
      payload.password = data.password
    }

    disable2FA.mutate(payload)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">2FA is Active</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your account is protected with two-factor authentication.
            </p>
          </div>
        </div>
        {!isDisabling && (
          <Button variant="outline" size="sm" onClick={() => setIsDisabling(true)}>
            Disable
          </Button>
        )}
      </div>

      {isDisabling && (
        <div className="p-5 border rounded-xl space-y-4">
          <div>
            <h4 className="font-medium text-sm">Disable Two-Factor Authentication</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Confirm your identity using your 6-digit 2FA code or your account password.
            </p>
          </div>

          <Tabs value={method} onValueChange={handleMethodChange} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code" className="flex items-center gap-2 text-xs">
                <Smartphone className="size-4" />
                <span>2FA Code</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2 text-xs">
                <Key className="size-4" />
                <span>Password</span>
              </TabsTrigger>
            </TabsList>

            <ReusableForm form={disableForm} onSubmit={onSubmit}>
              <TabsContent value="code">
                <FormField
                  control={disableForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          disabled={disable2FA.isPending}
                          value={field.value ?? ''}
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
              </TabsContent>

              <TabsContent value="password">
                <FormField
                  control={disableForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          disabled={disable2FA.isPending}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm" disabled={disable2FA.isPending}>
                  {disable2FA.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
                  Confirm Disable
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsDisabling(false)
                    disableForm.reset()
                  }}
                  disabled={disable2FA.isPending}
                >
                  Cancel
                </Button>
              </div>
            </ReusableForm>
          </Tabs>
        </div>
      )}
    </div>
  )
}
