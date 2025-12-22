import { uploadDocument } from "@/services/document.service"
import { useDrawerAlert } from "./alerts/useAlert"
import { useAuth } from "./useAuth"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { attempt } from "@/utils/attempt"

import { router } from "expo-router"
import type { DocumentType } from "@/components/documents/DocumentTypeSelector"
import {
   isFileDocument,
   isTextDocument,
   type AnalyzeDocument,
   type FileDocument,
} from "@/types/docs"
import { useInvalidator } from "./useInvalidator"
import { toast } from "@backpackapp-io/react-native-toast"

export function useAnalyzeAction() {
   const { user } = useAuth()
   const showBottomAlert = useDrawerAlert()
   const { invalidateQueries } = useInvalidator()

   const setAnalysisResult = useAnalysisStore(s => s.setAnalysisResult)

   async function handleAnalyzeDocument(document: AnalyzeDocument, docType: DocumentType) {
      if (!user) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: "Please log in to analyze documents",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })

         return
      }

      const toastId = toast.loading("Analyzing document...")

      let documentFile: FileDocument | File
      let filename: string

      if (isFileDocument(document)) {
         documentFile = {
            uri: document.uri,
            type: document.type || document.mimeType || "image/jpeg",
            name: document.name || document.title || "document",
         }
         filename = document.title || document.name || "document"
      } else if (isTextDocument(document)) {
         const textBlob = new Blob([document.content], { type: "text/plain" })
         documentFile = new File([textBlob], `${document.title || "document"}.txt`, {
            type: "text/plain",
         })
         filename = document.title || "document.txt"
      } else {
         showBottomAlert({
            type: "error",
            title: "Unsupported Document",
            message: "The selected document format is not supported. Please try again.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })

         toast.dismiss(toastId)
         return
      }

      const uploadResult = await attempt(() =>
         uploadDocument({
            document_file: documentFile,
            original_filename: filename,
            document_type: docType,
         })
      )

      if (!uploadResult.ok) {
         showBottomAlert({
            type: "error",
            title: "Analysis Error",
            message: uploadResult.error.message || "Failed to analyze document",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
      } else {
         setAnalysisResult(uploadResult.data)
         router.push("/analysisres")
      }

      await invalidateQueries([["documents"], ["documentStats"]])

      toast.dismiss(toastId)
   }

   return {
      handleAnalyzeDocument,
   }
}
