import { useState, useEffect, useRef } from "react"
import {
  getDocuments,
  getDocumentById,
  deleteDocument as deleteDocumentApi,
  AnalysisResponse,
} from "@/services/api"
import { attempt } from "@/utils/attempt"
import { FilterOptions } from "@/types/docs"

export const useBackendDocuments = (spaceId?: string) => {
  const [documents, setDocuments] = useState<AnalysisResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    ordering: "-created_at",
  })
  const hasFetchedOnce = useRef<boolean>(false)

  const loadDocuments = async (refresh = false, filters?: FilterOptions) => {
    if (error && !refresh) return

    setIsLoading(true)
    setError(null)

    const filtersToUse = { ...filters, ...currentFilters }
    if (spaceId) {
      filtersToUse.space_id = spaceId
    }

    const result = await attempt(getDocuments(1, filtersToUse))

    if (!result.ok) {
      console.log("Error loading documents:", result.error)
      setError(result.error.message || "Failed to load documents")
      setIsLoading(false)
      return
    }

    const response = result.data

    if (refresh) {
      setDocuments(response.results)
    } else {
      setDocuments(prev => [...prev, ...response.results])
    }

    setHasMore(!!response.next)
    setNextPage(response.next)
    setIsLoading(false)
  }

  const loadMoreDocuments = async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    setError(null)

    const pageMatch = nextPage?.match(/page=(\d+)/)
    const page = pageMatch ? parseInt(pageMatch[1]) : 2

    const filtersToUse = { ...currentFilters }
    if (spaceId) {
      filtersToUse.space_id = spaceId
    }

    const result = await attempt(getDocuments(page, filtersToUse))

    if (!result.ok) {
      setError(result.error.message || "Failed to load more documents")
      setIsLoading(false)
      return
    }

    const response = result.data
    setDocuments(prev => [...prev, ...response.results])
    setHasMore(!!response.next)
    setNextPage(response.next)
    setIsLoading(false)
  }

  const applyFilters = async (filters: FilterOptions) => {
    setCurrentFilters(filters)
    setDocuments([])
    setHasMore(true)
    setNextPage(null)
    await loadDocuments(true, filters)
  }

  const getDocument = async (documentId: string): Promise<AnalysisResponse | null> => {
    const result = await attempt(getDocumentById(documentId))

    if (!result.ok) {
      setError(result.error.message || "Failed to load document")
      return null
    }

    return result.data
  }

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    const result = await attempt(deleteDocumentApi(documentId))

    if (!result.ok) {
      setError(result.error.message || "Failed to delete document")
      return false
    }

    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    return true
  }

  const refreshDocuments = async () => {
    await loadDocuments(true)
  }

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      hasFetchedOnce.current = true
      loadDocuments(true)
    }
  }, [spaceId])

  return {
    documents,
    isLoading,
    error,
    hasMore,
    currentFilters,
    loadMoreDocuments,
    applyFilters,
    getDocument,
    deleteDocument,
    refreshDocuments,
    clearError: () => setError(null),
  }
}
