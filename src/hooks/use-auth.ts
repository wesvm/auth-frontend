import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authApi, authService } from '@/lib/api/auth'
import type { LoginSchema, ResetPasswordSchema, TwoFASchema } from '@/lib/validations/auth'

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token')
}

const useAuth = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem('access_token'),
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if ('ticket' in data) {
        toast.info('Two-Factor Authentication Required', {
          description: 'Please enter your 6-digit code',
        })

        authService.set2FATicket(data.ticket)
        navigate({ to: '/verify-2fa' })
        return
      }

      authService.setToken(data.access_token)
      queryClient.setQueryData(['auth', 'me'], data.account)

      toast.success('Welcome back!', {
        description: `Logged in as ${data.account.username}`,
      })

      navigate({ to: '/' })
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Account created successfully! Please verify your email.')

      navigate({ to: '/verify-email' })
    },
  })

  const verify2FAMutation = useMutation({
    mutationFn: authApi.verify2fa,
    onSuccess: (data) => {
      authService.clear2FATicket()
      authService.setToken(data.access_token)
      queryClient.setQueryData(['auth', 'me'], data.account)

      toast.success('Welcome back!', {
        description: `Logged in as ${data.account.email}`,
      })
      navigate({ to: '/' })
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message)
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message)
      navigate({ to: '/login' })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      authService.clearAll()
      queryClient.clear()
      toast.success('Logged out successfully')
      navigate({ to: '/login' })
    },
  })

  const login = (data: LoginSchema) => loginMutation.mutate(data)
  const logout = () => logoutMutation.mutate()
  const verify2FA = (data: TwoFASchema) => verify2FAMutation.mutate(data)
  const resetPassword = (data: ResetPasswordSchema) => resetPasswordMutation.mutate(data)
  const isAuthenticated = !!user && !!localStorage.getItem('access_token')

  return {
    // User data
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    verify2FA,
    resetPassword,
    logout,

    // Mutations
    registerMutation,
    forgotPasswordMutation,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isVerifying2FA: verify2FAMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isResetingPassword: resetPasswordMutation.isPending,
  }
}

export default useAuth
