/*
 *
 * abort error
 * **/
export class AbortError extends Error {
   constructor(message: string) {
      super(message)
      this.name = "AbortError"
   }
}

export function isAbortError(error: unknown): error is AbortError {
   return error instanceof AbortError
}

/*
 *timeout error
 * **/
export class TimeoutError extends Error {
   constructor(message: string) {
      super(message)
      this.name = "TimeoutError"
   }
}

export function isTimeoutError(error: unknown): error is TimeoutError {
   return error instanceof TimeoutError
}

/*
 * network error
 * **/
export class NetworkError extends Error {
   constructor(message: string) {
      super(message)
      this.name = "NetworkError"
   }
}

export function isNetworkError(error: unknown): error is NetworkError {
   return error instanceof NetworkError
}

/*
 * unknown error
 * **/
export class UnknownError extends Error {
   constructor(message: string) {
      super(message)
      this.name = "unknown"
   }
}

export function isUnknownError(error: unknown): error is UnknownError {
   return error instanceof UnknownError
}

/**
 * expected error
 * **/
export class ExpectedError extends Error {
   status: number

   constructor(status: number, message: string) {
      super(message)
      this.name = "ExpectedError"
      this.status = status
   }
}

export function isExpectedError(error: unknown): error is ExpectedError {
   return error instanceof ExpectedError
}
