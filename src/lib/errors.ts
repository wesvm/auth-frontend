import { toast } from "sonner"

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export const handleApiError = (error: any): ApiError => {
  // Extract status code
  const status = error?.response?.status || error?.status

  // Handle authentication/authorization errors
  if (status && [401, 403].includes(status)) {
    localStorage.removeItem('access_token')

    toast.error(
      status === 401 ? "Session expired" : "Access denied",
      {
        description: status === 401
          ? "Please log in again"
          : "You don't have permission to perform this action",
      }
    )

    // Redirect to login after a brief delay so user can see the toast
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)

    return {
      message: status === 401 ? "Unauthorized" : "Forbidden",
      status,
      code: status === 401 ? "UNAUTHORIZED" : "FORBIDDEN"
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
        toast.error("Not found", {
          description: "The requested resource doesn't exist",
        })
        return { message: "Not found", status, code: "NOT_FOUND" }

      case 500:
        toast.error("Server error", {
          description: "An unexpected error occurred",
        })
        return { message: "Server error", status, code: "SERVER_ERROR" }

      default:
        toast.error("Error", {
          description: message,
        })
        return { message, status, code: "API_ERROR" }
    }
  }

  // Unknown error
  const message = error?.message || "An unknown error occurred"
  toast.error("Unexpected error", {
    description: message,
  })

  return {
    message,
    code: "UNKNOWN_ERROR"
  }
}