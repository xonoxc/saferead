import { create } from "zustand"
import { getDocuments, getDocumentById, deleteDocument as deleteDocumentApi } from "@/services/api"
import { attempt } from "@/utils/attempt"
import type { FilterOptions } from "@/types/docs"
import type { AnalysisResponse } from "@/types/api/documents.types"

//  Types representing the state and actions of the documents store
type State = {
  documents: AnalysisResponse[] // List of currently loaded documents
  isLoading: boolean // Whether any document operation is in progress
  error: string | null // Any error that occurred
  hasMore: boolean // If there are more documents to load (pagination)
  nextPage: string | null // URL for the next page of documents
  currentFilters: FilterOptions // Currently applied filters
  hasFetchedOnce: boolean // Flag to avoid re-fetching on init
}

type Actions = {
  loadDocuments: (refresh?: boolean, filters?: FilterOptions) => Promise<void>
  loadMoreDocuments: () => Promise<void>
  applyFilters: (filters: FilterOptions) => Promise<void>
  getDocument: (documentId: string) => Promise<AnalysisResponse | null>
  deleteDocument: (documentId: string) => Promise<boolean>
  refreshDocuments: () => Promise<void>
  clearError: () => void
  init: (spaceId?: string) => void
}

type DocumentStore = State & Actions

export const useDocumentsStore = create<DocumentStore>((set, get) => {
  let _spaceId: string | undefined

  const prepareFilters = (filters?: FilterOptions): FilterOptions => {
    const base = { ...get().currentFilters, ...filters }
    if (_spaceId) base.space_id = _spaceId
    return base
  }

  return {
    documents: [],
    isLoading: false,
    error: null,
    hasMore: true,
    nextPage: null,
    currentFilters: { ordering: "-created_at" },
    hasFetchedOnce: false,

    init: (spaceId?: string) => {
      if (!get().hasFetchedOnce) {
        _spaceId = spaceId
        get().loadDocuments(true)
        set({ hasFetchedOnce: true })
      }
    },

    /** Load the first page of documents (with optional refresh and filters) */
    loadDocuments: async (refresh = false, filters?: FilterOptions) => {
      const state = get()
      if (state.error && !refresh) return

      set({ isLoading: true, error: null })

      const result = await attempt(getDocuments(1, filters))
      if (!result.ok) {
        set({ error: result.error.message || "Failed to load documents", isLoading: false })
        return
      }

      const response = result.data

      set(state => ({
        documents: refresh ? response.results : [...state.documents, ...response.results],
        hasMore: !!response.next,
        nextPage: response.next,
        isLoading: false,
      }))
    },

    /**  Load the next page of documents for infinite scroll */
    loadMoreDocuments: async () => {
      const { hasMore, isLoading, nextPage } = get()
      if (!hasMore || isLoading) return

      set({ isLoading: true, error: null })

      const pageMatch = nextPage?.match(/page=(\d+)/)
      const page = pageMatch ? parseInt(pageMatch[1]) : 2

      const result = await attempt(getDocuments(page, prepareFilters()))
      if (!result.ok) {
        set({ error: result.error.message || "Failed to load more documents", isLoading: false })
        return
      }

      const response = result.data
      set(state => ({
        documents: [...state.documents, ...response.results],
        hasMore: !!response.next,
        nextPage: response.next,
        isLoading: false,
      }))
    },

    /**  Apply new filters and reload documents from page 1 */
    applyFilters: async (filters: FilterOptions) => {
      set({
        currentFilters: filters,
        documents: [],
        hasMore: true,
        nextPage: null,
      })
      await get().loadDocuments(true, filters)
    },

    /**  Fetch a single document by ID */
    getDocument: async (documentId: string) => {
      const result = await attempt(getDocumentById(documentId))
      if (!result.ok) {
        set({ error: result.error.message || "Failed to load document" })
        return null
      }
      return result.data
    },

    /**  Delete a document and update the state */
    deleteDocument: async (documentId: string) => {
      const result = await attempt(deleteDocumentApi(documentId))
      if (!result.ok) {
        set({ error: result.error.message || "Failed to delete document" })
        return false
      }

      set(state => ({
        documents: state.documents.filter(doc => doc.id !== documentId),
      }))

      return true
    },

    /**  Refresh documents (same as loading page 1 with current filters) */
    refreshDocuments: async () => {
      await get().loadDocuments(true)
    },

    /**  Clear error message */
    clearError: () => set({ error: null }),
  }
})
