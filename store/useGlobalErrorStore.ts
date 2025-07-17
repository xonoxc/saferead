import { create } from "zustand"

interface GlobalError {
  message: string
  code?: string
}

interface ErrorStore {
  error: GlobalError | null
  setError: (error: GlobalError) => void
  clearError: () => void
}

export const useGlobalErrorStore = create<ErrorStore>(set => ({
  error: null,
  setError: error => set({ error }),
  clearError: () => set({ error: null }),
}))
