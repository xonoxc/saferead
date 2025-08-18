import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  getSpaces,
  deleteSpace as deleteSpaceApi,
  getSpaceDocuments as getSpaceDocumentsApi,
  getSpaceStats as getSpaceStatsApi,
  toggleFavoriteSpace as toggleFavoriteSpaceApi,
  pinDocumentToSpace,
  type PinDocumetToSpaceMethodParams,
} from "@/services/space.service"

import type { PaginatedSpaceDocuments } from "@/types/api/spaces.documents.types"
import type { PaginatedSpaces, Space } from "@/types/api/spaces.types"
import type { SpaceFilterOptions } from "@/types/spaces"

export const useSpaces = (filters?: SpaceFilterOptions, enabled = true) => {
  return useInfiniteQuery<PaginatedSpaces>({
    queryKey: ["spaces", filters],
    queryFn: ({ pageParam = 1 }) => getSpaces(pageParam as number, filters),
    getNextPageParam: lastPage => {
      if (!lastPage.next) return undefined
      const match = lastPage.next.match(/page=(\d+)/)
      return match ? parseInt(match[1]) : undefined
    },
    initialPageParam: 1,
    enabled,
    refetchOnMount: true,
  })
}

export const useDeleteSpace = () => {
  return useMutation({
    mutationFn: deleteSpaceApi,
    meta: {
      invalidatedQueries: [["spaces"]],
    },
  })
}

export const useSpaceDocuments = (spaceId: string, enabled = true) => {
  return useInfiniteQuery<PaginatedSpaceDocuments>({
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
}

export const useSpaceStats = (spaceId: string, enabled = true) => {
  return useQuery<Space>({
    queryKey: ["spaces", spaceId, "stats"],
    queryFn: () => getSpaceStatsApi(spaceId),
    enabled: enabled && !!spaceId,
  })
}

export const useToggleFavoriteSpace = (spaceId: string) => {
  return useMutation({
    mutationFn: () => toggleFavoriteSpaceApi(spaceId),
    meta: {
      invalidatedQueries: [["spaces", spaceId], ["spaces"]],
    },
  })
}

export const usePinDocumentMutation = () => {
  return useMutation({
    mutationFn: (data: PinDocumetToSpaceMethodParams) => pinDocumentToSpace(data),
    meta: {
      invalidatedQueries: [["spaces"]],
    },
  })
}
