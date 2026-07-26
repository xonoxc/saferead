import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query"
import {
   getDocuments,
   getDocumentById,
   deleteDocument as deleteDocumentApi,
} from "@/services/document.service"

import type { DocumentFilterOptions } from "@/types/docs"
import type { DocumentsListResponse } from "@/types/api/documents.types"

/*
 * Analysis runs on a Celery worker, so an upload returns `pending` and only
 * turns into `completed` a few seconds later. Nothing pushes that transition to
 * the client, so a scan in flight has to be polled or its results sit invisible
 * until the user manually refreshes.
 */
export const IN_PROGRESS_STATUSES = ["pending", "processing"]
export const ANALYSIS_POLL_INTERVAL_MS = 3000

export const isAnalysisInProgress = (status: unknown): boolean =>
   typeof status === "string" && IN_PROGRESS_STATUSES.includes(status)

export const useDocuments = (filters?: DocumentFilterOptions, enabled = true) => {
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
      /*
       * Poll only while something is actually being analysed, then stop. A flat
       * interval would keep waking the app up for a list that never changes.
       */
      refetchInterval: query => {
         const pages = query.state.data?.pages
         if (!pages) return false

         const waiting = pages.some(page =>
            page.results.some(doc => isAnalysisInProgress(doc.status))
         )
         return waiting ? ANALYSIS_POLL_INTERVAL_MS : false
      },
   })

   return query
}

export const useDocument = (documentId: string) => {
   return useQuery({
      queryKey: ["document", documentId],
      queryFn: () => getDocumentById(documentId),
      enabled: !!documentId,
      /*
       * getDocumentById resolves to the raw AxiosResponse, so the document's own
       * status lives at data.data.status - data.status is the HTTP code.
       */
      refetchInterval: query =>
         isAnalysisInProgress(query.state.data?.data?.status)
            ? ANALYSIS_POLL_INTERVAL_MS
            : false,
   })
}

export const useDeleteDocument = () => {
   return useMutation({
      mutationFn: deleteDocumentApi,
      meta: {
         invalidatedQueries: [["documents"]],
      },
   })
}
