import { useState } from "react"
import type { AnalyzeDocument } from "@/types/docs"
import type { UploadChipProps } from "@/components/analyize/UploadOptions"

export type UploadChipHookProps = Exclude<UploadChipProps, "onSelect">

export function useDocUploadChip({ selectedType, onDocumentUpload, onAnalyze }: UploadChipProps) {
   const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false)
   const [uploadedDocument, setUploadedDocument] = useState<AnalyzeDocument | null>(null)

   const handleUploadPress = async () => {
      const document = await onDocumentUpload()
      if (document) {
         setUploadedDocument(document)
         setIsBottomSheetVisible(true)
      }
   }

   const handleAnalyzePress = () => {
      if (uploadedDocument) {
         onAnalyze(uploadedDocument, selectedType)
         setIsBottomSheetVisible(false)
         setUploadedDocument(null)
      }
   }

   return {
      isBottomSheetVisible,
      handleUploadPress,
      handleAnalyzePress,
   }
}
