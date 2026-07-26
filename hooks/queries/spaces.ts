import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
   getSpaces,
   getSpace as getSpaceApi,
   deleteSpace as deleteSpaceApi,
   getSpaceDocuments as getSpaceDocumentsApi,
   getSpaceStats as getSpaceStatsApi,
   getOrCreateSpaceConversation,
   toggleFavoriteSpace as toggleFavoriteSpaceApi,
   deleteSpaceDocument as deleteSpaceDocumentApi,
   pinDocumentToSpace,
   type PinDocumetToSpaceMethodParams,
} from "@/services/space.service"

import type { PaginatedSpaceDocuments } from "@/types/api/spaces.documents.types"
import type { PaginatedSpaces, Space, SpaceStats } from "@/types/api/spaces.types"
import type { SpaceFilterOptions } from "@/types/spaces"

/*
 * Text extraction + embedding runs on a Celery worker, so an upload responds
 * `pending` and only reaches `ready` a few seconds later. Nothing pushes that
 * transition to the client: without polling, a freshly uploaded document sits
 * at "pending" until the user manually leaves the space and comes back, which
 * is what made indexing feel like it never finished.
 *
 * Tighter than the analysis poll in queries/docs.ts because indexing is the
 * shorter job - typically a few seconds - so a 3s tick would often be the only
 * thing standing between "uploaded" and "ready".
 */
export const INDEXING_IN_PROGRESS_STATUSES = ["pending", "processing"]
export const INDEXING_POLL_INTERVAL_MS = 1500

export const isIndexingInProgress = (status: unknown): boolean =>
   typeof status === "string" && INDEXING_IN_PROGRESS_STATUSES.includes(status)

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
      /*
       * Poll only while something is actually being indexed, then stop. A flat
       * interval would keep waking the app up for a list that never changes.
       */
      refetchInterval: query => {
         const pages = query.state.data?.pages
         if (!pages) return false

         const waiting = pages.some(page =>
            page.results.some(doc => isIndexingInProgress(doc.processing_status))
         )
         return waiting ? INDEXING_POLL_INTERVAL_MS : false
      },
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

/*
 * Delete a document from a space.
 *
 * Invalidates the space's document list and its summary counts as well as the
 * spaces list, since document_count is shown on the space card too.
 * **/
export const useDeleteSpaceDocument = (spaceId: string) => {
   return useMutation({
      mutationFn: (documentId: string) => deleteSpaceDocumentApi(documentId),
      meta: {
         invalidatedQueries: [
            ["spaces", spaceId, "documents"],
            ["spaces", spaceId, "stats"],
            ["spaces", "detail", spaceId],
            ["spaces"],
         ],
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
