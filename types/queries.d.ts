import "@tanstack/react-query"
/**
 * this one adds aditional field to meta type to allow invalidation of queries throough a global client
 */

declare module "@tanstack/react-query" {
  interface MutationMeta {
    invalidatedQueries?: string[][]
  }
}
