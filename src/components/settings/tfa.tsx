import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import useAuth from '@/hooks/use-auth'
import { authApi } from '@/lib/api/auth'
import type { TwoFAQrCodeResponse } from '@/types/api'
import type { User } from '@/types/models'
import { TFAActiveCard } from './tfa/tfa-active-card'
import { TFADisabledCard } from './tfa/tfa-disabled-card'
import { TFASetupWizard } from './tfa/tfa-setup-wizard'

export const TFASettings = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [qrData, setQrData] = useState<TwoFAQrCodeResponse | null>(null)

  const is2FAEnabled = Boolean(user?.isTwoFactorEnabled)

  const generate2FA = useMutation({
    mutationFn: authApi.generate2fa,
    onSuccess: (data) => {
      setQrData(data)
      toast.success('QR Code generated successfully')
    },
    onError: () => {
      toast.error('Failed to generate 2FA setup details')
    },
  })

  const handleEnableSuccess = () => {
    setQrData(null)
    queryClient.setQueryData<User>(['auth', 'me'], (oldUser) =>
      oldUser ? { ...oldUser, isTwoFactorEnabled: true } : oldUser
    )
    // Refetch in background for synchronization
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
  }

  const handleDisableSuccess = () => {
    queryClient.setQueryData<User>(['auth', 'me'], (oldUser) =>
      oldUser ? { ...oldUser, isTwoFactorEnabled: false } : oldUser
    )
    // Refetch in background for synchronization
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
  }

  // State 1: 2FA is currently active
  if (is2FAEnabled) {
    return <TFAActiveCard onDisabledSuccess={handleDisableSuccess} />
  }

  // State 2: 2FA Setup in progress
  if (qrData) {
    return (
      <TFASetupWizard
        qrData={qrData}
        onSuccess={handleEnableSuccess}
        onRegenerate={() => generate2FA.mutate()}
        onCancel={() => setQrData(null)}
        isRegenerating={generate2FA.isPending}
      />
    )
  }

  // State 3: 2FA not configured
  return (
    <TFADisabledCard
      onStartSetup={() => generate2FA.mutate()}
      isGenerating={generate2FA.isPending}
    />
  )
}
