import { AxiosError } from "axios"

export type ExpectedError = {
  status: number
  message: string
}

type ErrorType = Error | ExpectedError
/*
 *typescript utility for handling async operations with error handling
 **/
type Ok<T> = { ok: true; data: T }
type Err<E> = { ok: false; error: E }
export type Result<T, E> = Ok<T> | Err<E>

/*
 *
 *result function
 * **/
function ok<T>(data: T): Ok<T> {
  return { ok: true, data }
}

/*
 *
 *error function
 * **/
function err<E>(error: E): Err<E> {
  return { ok: false, error }
}

/*
 *
 * actual attempt function
 * **/
export async function attempt<T, E = ErrorType>(fn: () => Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await fn()
    return ok(data)
  } catch (error: any) {
    //Axios specific error handling
    if (error instanceof AxiosError) {
      const axiosError = handleAxiosError(error)
      if (axiosError) {
        return err(axiosError as E)
      }
    }

    return err(error as E)
  }
}

/*
 * A Synchronous version of attempt function
 * **/
export function attemptSync<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const data = fn()
    return ok(data)
  } catch (error: any) {
    return err(error as E)
  }
}

/*
 * handleAxiosError function : handles axios errors and returns a structured error message
 * **/
const handleAxiosError = (error: any) => {
  if (error.response) {
    const contentType = error.response.headers["content-type"]
    const errorStatus = error.response.status

    if (contentType && contentType.includes("application/json")) {
      const serverMessage =
        error.response.data.message ||
        error.response.data.error ||
        JSON.stringify(error.response.data)

      return {
        status: errorStatus,
        message: serverMessage,
      }
    } else {
      return {
        status: errorStatus,
        message: "Internal server error. please try again later!",
      }
    }
  }
}
