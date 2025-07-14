import { useState, useEffect } from 'react'
import { getDocuments, getDocumentById, deleteDocument as deleteDocumentApi, AnalysisResponse, DocumentsListResponse } from '@/services/api'
import { attempt } from '@/utils/attempt'

export const useBackendDocuments = () => {
  const [documents, setDocuments] = useState<AnalysisResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [nextPage, setNextPage] = useState<string | null>(null)

  const loadDocuments = async (refresh = false) => {
    setIsLoading(true)
    setError(null)

    const result = await attempt(getDocuments())
    
    if (!result.ok) {
      setError(result.error.message || 'Failed to load documents')
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

    // Extract page number from next URL
    const pageMatch = nextPage?.match(/page=(\d+)/)
    const page = pageMatch ? parseInt(pageMatch[1]) : 2

    const result = await attempt(getDocuments(page))
    
    if (!result.ok) {
      setError(result.error.message || 'Failed to load more documents')
      setIsLoading(false)
      return
    }

    const response = result.data
    setDocuments(prev => [...prev, ...response.results])
    setHasMore(!!response.next)
    setNextPage(response.next)
    setIsLoading(false)
  }

  const getDocument = async (documentId: string): Promise<AnalysisResponse | null> => {
    const result = await attempt(getDocumentById(documentId))
    
    if (!result.ok) {
      setError(result.error.message || 'Failed to load document')
      return null
    }

    return result.data
  }

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    const result = await attempt(deleteDocumentApi(documentId))
    
    if (!result.ok) {
      setError(result.error.message || 'Failed to delete document')
      return false
    }

    // Remove from local state
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    return true
  }

  const refreshDocuments = () => {
    loadDocuments(true)
  }

  useEffect(() => {
    loadDocuments(true)
  }, [])

  return {
    documents,
    isLoading,
    error,
    hasMore,
    loadMoreDocuments,
    getDocument,
    deleteDocument,
    refreshDocuments,
    clearError: () => setError(null),
  }
}