import { MutationCache, type QueryClient } from "@tanstack/react-query"

export function createApplicationMutationCache(queryClientFn: () => QueryClient) {
   return new MutationCache({
      /*
       * this is a global handler that invalidates the queries after a successful mutation
       * just add
       * ***meta: { invalidatedQueries: [["queryKey"]] }***
       * to the mutation options
       */
      onSuccess: async function (_data, _variables, _context, mutation) {
         const invalidates = mutation.meta?.invalidatedQueries
         if (invalidates) {
            await Promise.all(
               invalidates.map(key => queryClientFn().invalidateQueries({ queryKey: key }))
            )
         }
      },
   })
}
