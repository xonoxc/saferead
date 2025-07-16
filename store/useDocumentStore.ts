import { create } from "zustand"
import type { FilterOptions } from "@/types/docs"

type State = {
  currentFilters: FilterOptions
  hasFetchedOnce: boolean
  error: string | null
}

type Actions = {
  init: (spaceId?: string) => void
  applyFilters: (filters: FilterOptions) => void
  clearError: () => void
}

export const useDocumentsStore = create<State & Actions>((set, get) => {
  let _spaceId: string | undefined

  return {
    currentFilters: { ordering: "-created_at" },
    hasFetchedOnce: false,
    error: null,

    init: (spaceId?: string) => {
      if (!get().hasFetchedOnce) {
        _spaceId = spaceId
        set({ hasFetchedOnce: true })
      }
    },

    applyFilters: filters => {
      set({ currentFilters: { ...filters, space_id: _spaceId } })
    },

    clearError: () => set({ error: null }),
  }
})
