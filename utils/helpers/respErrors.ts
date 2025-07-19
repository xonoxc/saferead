import { attemptSync } from "../attempt"

/*
 *
 * Get error message wrapper
 * **/
export function getErrorMessage(error: any): string {
  if (error.status >= 400 && error.status < 500) {
    return extractValidationErrorMessage(error.message)
  } else if (error.status === 500) {
    return "Internal server error, try again later~ 🥺"
  }

  return typeof error.message === "string" ? error.message : "Unexpected error~!"
}

/**
 * Extracts the first validation error message from DRF-style JSON.
 * @param message - Error message string or parsed object from the server.
 * @returns A clean user-friendly error message.
 */
export function extractValidationErrorMessage(message: string | object): string {
  let data = message

  if (typeof message === "string") {
    const res = attemptSync(JSON.parse(message))
    if (!res.ok) {
      return message
    }
    data = res.data
  }

  if (typeof data !== "object" || data === null) {
    return "Something went wrong... 😢"
  }

  if ("detail" in data && typeof data.detail === "string") {
    return data.detail
  }

  if ("non_field_errors" in data && Array.isArray(data.non_field_errors)) {
    return data.non_field_errors[0]
  }

  const [firstKey] = Object.keys(data)
  const firstValue = (data as Record<string, any>)[firstKey]

  if (Array.isArray(firstValue)) {
    return firstValue[0]
  }

  if (typeof firstValue === "string") {
    return firstValue
  }

  if (typeof firstValue === "object" && firstValue !== null) {
    const nestedKey = Object.keys(firstValue)[0]
    const nestedVal = firstValue[nestedKey]
    if (Array.isArray(nestedVal)) return nestedVal[0]
  }

  return "Unknown validation error. Please try again~ 🥺"
}
