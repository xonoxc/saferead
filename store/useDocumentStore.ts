import { create } from "zustand"

import type { FilterOptions } from "@/types/docs"

type State = {
  spaceId?: string
  currentFilters: FilterOptions
  hasFetchedOnce: boolean
  error: string | null
}

type Actions = {
  init: (spaceId?: string) => void
  applyFilters: (filters: FilterOptions) => void
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
          currentFilters: { ...get().currentFilters, space_id: spaceId },
        })
      }
    },

    applyFilters: filters => {
      const { spaceId } = get()
      set({ currentFilters: { ...filters, space_id: spaceId } })
    },

    clearError: () => set({ error: null }),

    resetFilters: () => {
      const { spaceId } = get()
      set({
        currentFilters: { ordering: "-created_at", space_id: spaceId },
        error: null,
      })
    },
  }
})
