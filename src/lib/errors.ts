import { toast } from "sonner"
import { authService } from "@/lib/api/auth"

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export const handleApiError = (error: any): ApiError => {
  // Extract status code
  const status = error?.response?.status || error?.status
  const errorData = error?.response?.data

  if (status === 401 || status === 403) {
    // Specific handling for 2FA verification errors
    if (errorData?.message?.includes('ticket')) {
      authService.clear2FATicket()

      toast.error("Verification code expired", {
        description: "Please log in again to get a new code",
      })

      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)

      return {
        message: "Invalid or expired ticket",
        status,
        code: "TICKET_EXPIRED"
      }
    }

    // Specific handling for invalid credentials
    if (errorData?.message?.includes('credentials')) {
      toast.error("Invalid credentials")

      return {
        message: "Invalid credentials",
        status,
        code: "INVALID_CREDENTIALS"
      }
    }

    if (errorData?.message?.toLowerCase().includes('unauthenticated')) {
      authService.clearAll()

      toast.error("Session expired", {
        description: "Your session has expired. Please log in again",
      })

      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)

      return {
        message: "Unauthenticated",
        status,
        code: "SESSION_EXPIRED"
      }
    }

    // For general 403 errors (not 401), handle as forbidden
    if (status === 403) {
      toast.error("Access denied", {
        description: "You don't have permission to access this resource",
      })

      return {
        message: "Forbidden",
        status,
        code: "FORBIDDEN"
      }
    }

    toast.error("Authentication required", {
      description: "Please log in to continue",
    })

    return {
      message: errorData?.message || "Unauthorized",
      status,
      code: "UNAUTHORIZED"
    }
  }

  // Network error
  if (error?.name === 'NetworkError' || !navigator.onLine) {
    toast.error("Connection error", {
      description: "Please check your internet connection",
    })
    return {
      message: "Connection error",
      code: "NETWORK_ERROR"
    }
  }

  // API error
  if (error?.response) {
    const message = error.response?.data?.message || "Server error"

    switch (status) {
      case 404:
        toast.error("The requested resource doesn't exist")
        return { message: "Not found", status, code: "NOT_FOUND" }

      case 500:
        toast.error("An unexpected error occurred")
        return { message: "Server error", status, code: "SERVER_ERROR" }

      default:
        toast.error(message)
        return { message, status, code: "API_ERROR" }
    }
  }

  // Unknown error
  const message = error?.message || "An unknown error occurred"
  toast.error(message)

  return {
    message,
    code: "UNKNOWN_ERROR"
  }
}