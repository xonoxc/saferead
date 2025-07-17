import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getDocuments, getDocumentById, deleteDocument as deleteDocumentApi } from "@/services/api"
import type { FilterOptions } from "@/types/docs"
import type { DocumentsListResponse } from "@/types/api/documents.types"

export const useDocuments = (filters?: FilterOptions, enabled = true) => {
  const query = useInfiniteQuery<DocumentsListResponse>({
    queryKey: ["documents", filters],
    queryFn: ({ pageParam = 1 }) => getDocuments(pageParam as number, filters),
    getNextPageParam: lastPage => {
      if (!lastPage.next) return undefined
      const match = lastPage.next.match(/page=(\d+)/)
      return match ? parseInt(match[1]) : undefined
    },
    initialPageParam: 1,
    enabled,
    refetchOnMount: true,
  })

  return query
}

export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocumentById(documentId),
    enabled: !!documentId,
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDocumentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })
}
