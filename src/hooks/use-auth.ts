import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/queries'
import type { LoginRequest, RegisterRequest } from '@/types/api'

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
      localStorage.setItem('access_token', data.access_token)
      queryClient.setQueryData(['auth', 'me'], data.user)
      toast.success('Welcome back!', {
        description: `Logged in as ${data.user.name}`,
      })
      navigate({ to: '/' })
    },
    onError: () => {
      toast.error('Login failed', {
        description: 'Invalid credentials',
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      queryClient.setQueryData(['auth', 'me'], data.user)
      toast.success('Account created!', {
        description: 'Welcome to the platform',
      })
      navigate({ to: '/' })
    },
    onError: () => {
      toast.error('Registration failed', {
        description: 'Please check your information and try again',
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('access_token')
      queryClient.clear()
      toast.success('Logged out successfully')
      navigate({ to: '/login' })
    },
  })

  const login = (data: LoginRequest) => loginMutation.mutate(data)
  const register = (data: RegisterRequest) => registerMutation.mutate(data)
  const logout = () => logoutMutation.mutate()
  const isAuthenticated = !!user && !!localStorage.getItem('access_token')

  return {
    // User data
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}

export default useAuth