import { useAuth } from "./useAuth"
import { useDrawerAlert } from "./alerts/useAlert"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { useAnalyzeAction } from "./useAnalyzeAction"
import { scanDocument } from "@/utils/docs/scanner"

export function useDocumentScan() {
   const { user } = useAuth()
   const showBottomAlert = useDrawerAlert()

   const { handleAnalyzeDocument } = useAnalyzeAction()

   const selectedDocumentType = useAnalysisStore(s => s.selectedDocumentType)

   const handleDocumentScan = async () => {
      if (!user) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: "Please log in to scan documents",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      const result = await scanDocument()
      if (!result.ok) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: result.error?.message || "Failed to scan document",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      await handleAnalyzeDocument(result.data, selectedDocumentType)
   }

   return {
      handleDocumentScan,
   }
}
