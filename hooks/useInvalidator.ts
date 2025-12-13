import { useQueryClient } from "@tanstack/react-query"

/*
 * this hook provides a way to invalidate multiple queries at once
 * **/
export function useInvalidator() {
   const queryClient = useQueryClient()

   async function invalidateQueries(queryKeys: Array<readonly unknown[]>) {
      await Promise.all([
         ...queryKeys.map(key =>
            queryClient.invalidateQueries({
               queryKey: key,
            })
         ),
      ])
   }

   return {
      invalidateQueries,
   }
}
