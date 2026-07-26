import { useQuery } from "@tanstack/react-query"
import { getDocumentStats } from "@/services/document.service"

import { ANALYSIS_POLL_INTERVAL_MS } from "@/hooks/queries/docs"
import type { StatsResponse } from "@/types/api/documents.types"

export const useDocumentStats = () => {
   const result = useQuery<StatsResponse, Error>({
      queryKey: ["documentStats"],
      queryFn: getDocumentStats,
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnMount: true,
      /*
       * The home screen renders entirely off these counts, so while any scan is
       * pending or processing on the worker, poll until the counts settle -
       * otherwise a completed analysis only appears on a manual pull-to-refresh.
       */
      refetchInterval: query => {
         const stats = query.state.data
         if (!stats) return false
         return stats.pending > 0 || stats.processing > 0 ? ANALYSIS_POLL_INTERVAL_MS : false
      },
   })

   return {
      ...result,
      stats: result.data,
      error: result.isError ? result.error.message : null,
   }
}
