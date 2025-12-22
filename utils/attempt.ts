import { AxiosError, type AxiosResponse } from "axios"

export type ExpectedError = {
   status: number
   message: string
}

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
 * AttemptArg : type for the argument of attempt function
 * **/
type AttemptArg<T> = Promise<T | AxiosResponse<T>>

/*
 * ErrorType : union type for Error and ExpectedError
 * **/
type ErrorType = Error | ExpectedError
/*
 *
 * actual attempt function | axios overloaded
 *
 * **/
export async function attempt<T, E = ErrorType>(fn: () => AttemptArg<T>): Promise<Result<T, E>> {
   try {
      const result = await fn()

      const data = isAxiosResponse(result) ? result.data : result

      return ok(data as T)
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

/**
 * andThenAsync function : chains asynchronous Result operations
 * **/
export async function andThenAsync<T, E, U>(
   result: Promise<Result<T, E>> | Result<T, E>,
   fn: (value: T) => Promise<Result<U, E>>
): Promise<Result<U, E>> {
   const resolved = await result
   if (!resolved.ok) return resolved
   return fn(resolved.data)
}
/*
 * isAxiosResponse function : checks if the response is an AxiosResponse
 * **/
function isAxiosResponse<T>(res: any): res is AxiosResponse<T> {
   return res && typeof res === "object" && "data" in res && "status" in res && "headers" in res
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
 * this andThen function : chains Result operations
 * **/
export function andThen<T, E, U>(
   result: Result<T, E>,
   fn: (value: T) => Result<U, E>
): Result<U, E> {
   if (!result.ok) return result
   return fn(result.data)
}

/*
 * handleAxiosError function : handles axios errors and returns a structured error message
 * **/

interface ExpectedAxiosError {
   status: number
   message: string
}

const handleAxiosError = (error: AxiosError): ExpectedAxiosError => {
   switch (true) {
      case !!error.response:
         return serverError(error)

      case error.code === "ECONNABORTED":
         return timeoutError()

      case !error.response:
         return networkError()

      default:
         return unknownAxiosError()
   }
}

function serverError(error: AxiosError): ExpectedError {
   const response = error.response!
   const contentType = response.headers?.["content-type"]

   if (contentType?.includes("application/json")) {
      const message =
         (response.data as any)?.message ||
         (response.data as any)?.error ||
         JSON.stringify(response.data)

      return {
         status: response.status,
         message,
      }
   }

   return {
      status: response.status,
      message: "Internal server error. Please try again later!",
   }
}

function timeoutError(): ExpectedError {
   return {
      status: 0,
      message: "Request timed out. Please try again.",
   }
}

function networkError(): ExpectedError {
   return {
      status: 0,
      message: "Network error. Please check your connection.",
   }
}

function unknownAxiosError(): ExpectedError {
   return {
      status: 0,
      message: "Unexpected error occurred.",
   }
}
