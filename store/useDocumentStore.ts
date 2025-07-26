import { create } from "zustand"

import type { DocumentFilterOptions } from "@/types/docs"

type State = {
  spaceId?: string
  currentFilters: DocumentFilterOptions
  hasFetchedOnce: boolean
  error: string | null
}

type Actions = {
  init: (spaceId?: string) => void
  applyFilters: (filters: DocumentFilterOptions) => void
  clearError: () => void
  resetFilters: () => void
}

export const useDocumentsStore = create<State & Actions>((set, get) => {
  return {
    spaceId: undefined,
    currentFilters: { ordering: "-created_at" },
    hasFetchedOnce: false,
    error: null,

    init: (spaceId?: string) => {
      if (!get().hasFetchedOnce) {
        set({
          spaceId: spaceId,
          hasFetchedOnce: true,
          currentFilters: { ...get().currentFilters, space: spaceId },
        })
      }
    },

    applyFilters: filters => {
      const { spaceId } = get()
      set({ currentFilters: { ...filters, space: spaceId } })
    },

    clearError: () => set({ error: null }),

    resetFilters: () => {
      const { spaceId } = get()
      set({
        currentFilters: { ordering: "-created_at", space: spaceId },
        error: null,
      })
    },
  }
})
