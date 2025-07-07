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
export async function attempt<T, E = Error>(fn: () => Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await fn()
    return ok(data)
  } catch (error) {
    return err(error as E)
  }
}
