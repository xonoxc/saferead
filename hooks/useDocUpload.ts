import { useDrawerAlert } from "./alerts/useAlert"

import { pickDocument } from "@/utils/docs/picker"
import { useAuth } from "./useAuth"
import { useAnalyzeAction } from "./useAnalyzeAction"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import type { AnalyzeDocument } from "@/types/docs"
import type { DocumentType } from "@/components/documents/DocumentTypeSelector"

export function useDocUpload() {
   const { user } = useAuth()

   const showBottomAlert = useDrawerAlert()
   const { handleAnalyzeDocument } = useAnalyzeAction()

   const selectedDocType = useAnalysisStore(s => s.selectedDocumentType)
   const setSelectedDocType = useAnalysisStore(s => s.setSelectedDocumentType)

   const setIsAnalyzing = useAnalysisStore(s => s.setIsAnalyzing)

   const handleDocumentPick = async (): Promise<AnalyzeDocument | null> => {
      if (!user) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: "Please log in to upload documents",
            actions: [
               {
                  text: "OK",
                  style: "primary",
                  onPress: () => {},
               },
            ],
         })
         return null
      }

      const result = await pickDocument()
      if (!result.ok) {
         if (result.canceled) return null
         showBottomAlert({
            type: "error",
            title: "Error",
            message: result.error?.message || "Failed to pick document",
            actions: [
               {
                  text: "OK",
                  style: "primary",
                  onPress: () => {},
               },
            ],
         })
         return null
      }

      return result.data
   }

   const handleAnalyze = async (document: AnalyzeDocument, docType: DocumentType) => {
      setIsAnalyzing(true)
      await handleAnalyzeDocument(document, docType)

      setIsAnalyzing(false)
   }

   return {
      handleDocumentPick,
      handleAnalyze,
      selectedDocType,
      setSelectedDocType,
   }
}
