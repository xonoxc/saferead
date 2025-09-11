import { create } from "zustand"

import type { AnalysisResponse } from "@/types/api/documents.types"

type State = {
  analysisResult: AnalysisResponse | null
}

type Actions = {
  setAnalysisResult: (result: AnalysisResponse | null) => void
}

export const useAnalysisStore = create<State & Actions>(set => {
  return {
    analysisResult: null,
    setAnalysisResult: (result: AnalysisResponse | null) => {
      set({ analysisResult: result })
    },
  }
})
