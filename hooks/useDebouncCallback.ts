import { useRef, useEffect } from "react"

/**
 * A reusable hook to debounce a callback function.
 * Only calls the function after the specified delay and resets on new calls.
 *
 * @param callback - the function to debounce
 * @param delay - the debounce delay in milliseconds
 * @returns a debounced version of the callback
 */
export const useDebouncedCallback = <T extends (...args: any[]) => void>(
   callback: T,
   delay: number
) => {
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   // Cleanup timeout on unmount — avoid memory leaks
   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
         }
      }
   }, [])

   const debounced = (...args: Parameters<T>) => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
         callback(...args)
      }, delay)
   }

   return debounced
}
