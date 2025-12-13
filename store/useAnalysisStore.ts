import { create } from "zustand"

import type { AnalysisResponse } from "@/types/api/documents.types"
import type { DocumentType } from "@/components/documents/DocumentTypeSelector"

type State = {
   analysisResult: AnalysisResponse | null
   isAnalyzing: boolean
   selectedDocumentType: DocumentType
}

type Actions = {
   setAnalysisResult: (result: AnalysisResponse | null) => void
   setIsAnalyzing: (state: boolean) => void
   setSelectedDocumentType: (docType: DocumentType) => void
}

export const useAnalysisStore = create<State & Actions>(set => {
   return {
      analysisResult: null,
      setAnalysisResult: (result: AnalysisResponse | null) => {
         set({
            analysisResult: result,
         })
      },

      /*
       * global shared is analyzing state
       * this will be shared between where ever needed
       * **/
      isAnalyzing: false,
      setIsAnalyzing: (state: boolean) => {
         set({
            isAnalyzing: state,
         })
      },

      /*
       * currently selected document type for analysis
       * **/
      selectedDocumentType: "other",
      setSelectedDocumentType: (docType: DocumentType) => {
         set({
            selectedDocumentType: docType,
         })
      },
   }
})
