import { toast } from "sonner"

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export const handleApiError = (error: any): ApiError => {
  // Extract status code
  const status = error?.response?.status || error?.status

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