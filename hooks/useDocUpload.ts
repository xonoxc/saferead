import { useDrawerAlert } from "./alerts/useAlert"

import { pickDocument } from "@/utils/docs/picker"
import { useAuth } from "./useAuth"
import { useAnalyzeAction } from "./useAnalyzeAction"
import { toast } from "@backpackapp-io/react-native-toast"
import { useAnalysisStore } from "@/store/useAnalysisStore"

export function useDocUpload() {
   const { user } = useAuth()

   const showBottomAlert = useDrawerAlert()
   const { handleAnalyzeDocument } = useAnalyzeAction()

   const selectedDocType = useAnalysisStore(s => s.selectedDocumentType)
   const setSelectedDocType = useAnalysisStore(s => s.setSelectedDocumentType)

   const handleDocumentUpload = async () => {
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
         return
      }

      const result = await pickDocument()
      if (!result.ok) {
         if (result.canceled) return
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
         return
      }

      const id = toast.loading("Analyzing document...")

      await handleAnalyzeDocument(result.data, selectedDocType)

      toast.dismiss(id)
   }

   return {
      handleDocumentUpload,
      selectedDocType,
      setSelectedDocType,
   }
}
