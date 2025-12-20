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

export const useActiveFilterCount = () =>
   useDocumentsStore(state => {
      const { currentFilters } = state

      return Object.entries(currentFilters).filter(([key, value]) => {
         if (key === "ordering" || key === "space") return false
         if (value === undefined || value === null) return false
         if (Array.isArray(value)) return value.length > 0
         if (typeof value === "string") return value.trim().length > 0
         return true
      }).length
   })
