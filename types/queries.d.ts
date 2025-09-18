/**
 * this one adds aditional field to meta type to allow invalidation of queries throough a global client
 */
import "@tanstack/react-query"

interface CustomMutationMeta extends Record<string, unknown> {
   invalidatedQueries?: Array<Array<string | unknown>>
}

declare module "@tanstack/react-query" {
   interface Register {
      mutationMeta: CustomMutationMeta
   }
}
