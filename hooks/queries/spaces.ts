import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
   getSpaces,
   getSpace as getSpaceApi,
   deleteSpace as deleteSpaceApi,
   getSpaceDocuments as getSpaceDocumentsApi,
   getSpaceStats as getSpaceStatsApi,
   getOrCreateSpaceConversation,
   toggleFavoriteSpace as toggleFavoriteSpaceApi,
   pinDocumentToSpace,
   type PinDocumetToSpaceMethodParams,
} from "@/services/space.service"

import type { PaginatedSpaceDocuments } from "@/types/api/spaces.documents.types"
import type { PaginatedSpaces, Space, SpaceStats } from "@/types/api/spaces.types"
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

/*
 * Fetch one space directly.
 *
 * Detail screens used to search the paginated list for the space, so opening a
 * space that lived past the first page never resolved.
 * **/
export const useSpace = (spaceId: string, enabled = true) => {
   return useQuery<Space>({
      queryKey: ["spaces", "detail", spaceId],
      queryFn: () => getSpaceApi(spaceId),
      enabled: enabled && !!spaceId,
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
   return useQuery<SpaceStats>({
      queryKey: ["spaces", spaceId, "stats"],
      queryFn: () => getSpaceStatsApi(spaceId),
      enabled: enabled && !!spaceId,
   })
}

/*
 * Resolve the space's chat thread, creating it only on first use.
 *
 * Kept as a mutation rather than a query because it can create a row, and
 * because callers want to await it at the moment chat is opened.
 * **/
export const useSpaceConversation = () => {
   const mutation = useMutation({
      mutationFn: (spaceId: string) => getOrCreateSpaceConversation(spaceId),
   })

   return {
      ...mutation,
      resolveConversation: mutation.mutateAsync,
      isResolvingConversation: mutation.isPending,
   }
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
