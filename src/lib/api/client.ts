import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { authService } from '@/lib/api/auth'
import type { ApiResponse } from '@/types/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle responses
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Extraer solo la data del ApiResponse
    // Si la respuesta tiene data, la devuelve, sino devuelve la respuesta completa
    return response.data.data !== undefined ? { ...response, data: response.data.data } : response
  },
  (error: AxiosError<ApiResponse>) => {
    // Network error
    if (!error.response) {
      console.error('Network Error:', error.message)
      return Promise.reject({
        ...error,
        message: 'Network connection failed',
      })
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.message,
        url: error.config?.url,
        method: error.config?.method,
      })
    }

    return Promise.reject(error)
  }
)

// Helper functions for common HTTP methods
export const api = {
  get: <T>(url: string, config?: any) => apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: any, config?: any) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: any, config?: any) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: any, config?: any) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: any) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
}
