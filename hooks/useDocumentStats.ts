import { useQuery } from "@tanstack/react-query"
import { getDocumentStats } from "@/services/document.service"

import type { StatsResponse } from "@/types/api/documents.types"

export const useDocumentStats = () => {
  const result = useQuery<StatsResponse, Error>({
    queryKey: ["documentStats"],
    queryFn: getDocumentStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnMount: true,
  })

  return {
    ...result,
    stats: result.data,
    error: result.isError ? result.error.message : null,
  }
}
