import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import {
  getSpaces,
  deleteSpace as deleteSpaceApi,
  getSpaceDocuments as getSpaceDocumentsApi,
  getSpaceStats as getSpaceStatsApi,
  toggleFavoriteSpace as toggleFavoriteSpaceApi,
} from "@/services/api"
import type { PaginatedSpaces, Space } from "@/types/api/spaces.types"
import { PaginatedSpaceDocuments } from "@/types/api/spaces.documents.types"

export const useSpaces = (enabled = true) => {
  const query = useInfiniteQuery<PaginatedSpaces>({
    queryKey: ["spaces"],
    queryFn: ({ pageParam = 1 }) => getSpaces(pageParam as number),
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

export const useDeleteSpace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSpaceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] })
    },
  })
}

export const useSpaceDocuments = (spaceId: string, enabled = true) => {
  const query = useInfiniteQuery<PaginatedSpaceDocuments>({
    queryKey: ["spaces", spaceId, "documents"],
    queryFn: ({ pageParam = 1 }) => getSpaceDocumentsApi(spaceId, pageParam as number),
    getNextPageParam: lastPage => {
      if (!lastPage.next) return undefined
      const match = lastPage.next.match(/page=(\d+)/)
      return match ? parseInt(match[1]) : undefined
    },
    initialPageParam: 1,
    enabled: enabled && !!spaceId,
  })

  return query
}

export const useSpaceStats = (spaceId: string, enabled = true) => {
  const query = useQuery<Space>({
    queryKey: ["spaces", spaceId, "stats"],
    queryFn: () => getSpaceStatsApi(spaceId),
    enabled: enabled && !!spaceId,
  })

  return query
}

export const useToggleFavoriteSpace = (spaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { is_favorite: boolean }) => toggleFavoriteSpaceApi(spaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces", spaceId] })
      queryClient.invalidateQueries({ queryKey: ["spaces"] })
    },
  })
}
