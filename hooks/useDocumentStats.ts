import { useQuery } from "@tanstack/react-query"
import { getDocumentStats } from "@/services/document.service"
import { StatsResponse } from "@/types/api/documents.types"

export const useDocumentStats = () => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StatsResponse, Error>({
    queryKey: ["documentStats"],
    queryFn: getDocumentStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnMount: true,
  })

  return {
    stats,
    isLoading,
    error: isError ? error.message : null,
    refetch,
  }
}
