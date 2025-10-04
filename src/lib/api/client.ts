import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

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
    const token = localStorage.getItem('access_token')

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
  (response) => {
    // Any status code within the range of 2xx will trigger this function
    return response
  },
  (error: AxiosError) => {
    // Any status codes outside the range of 2xx will trigger this function

    // Network error
    if (!error.response) {
      console.error('Network Error:', error.message)
      const { name: _name, message: _message, ...restError } = error
      return Promise.reject({
        name: 'NetworkError',
        message: 'Network connection failed',
        ...restError,
      })
    }

    // Server returned an error response
    const status = error.response.status

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
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
