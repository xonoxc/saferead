import { router } from "expo-router"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useSpaceStore } from "@/store/useSpaceStore"
import { useDocuments } from "./queries/docs"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { useDrawerAlert } from "./alerts/useAlert"
import { useTabBarVisibilty } from "./useTabBarVisiblitiy"

import type { AnalysisResponse } from "@/types/api/documents.types"
import { useAnalyzeAction } from "./useAnalyzeAction"
import { pickDocument } from "@/utils/docs/picker"
import { toast } from "@backpackapp-io/react-native-toast"

export function useAnalysis() {
   const { user } = useAuth()

   const showBottomAlert = useDrawerAlert()
   const { handleAnalyzeDocument } = useAnalyzeAction()

   /*
    * all the stores used in this hook
    * ***/
   const analysisResult = useAnalysisStore(s => s.analysisResult)
   const setAnalysisResult = useAnalysisStore(s => s.setAnalysisResult)
   const selectedSpace = useSpaceStore(s => s.selectedSpace)
   const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)

   const selectedDocumentType = useAnalysisStore(s => s.selectedDocumentType)
   const setSelectedDocumentType = useAnalysisStore(s => s.setSelectedDocumentType)

   const [showTextInput, setShowTextInput] = useState(false)

   const { data, isLoading: isRecentDocumentsLoading } = useDocuments()

   const recentDocuments = data?.pages.flatMap(page => page.results) ?? []

   /*
    *
    * this is here to ensure that the tab bar is hidden in the space chat mode
    * i.e. when active stpace id is present
    * **/
   useTabBarVisibilty(!selectedSpace?.id)

   /*
    *
    * all the handlers below
    * ***/
   const handleItemPress = (item: string) => {
      console.log(`You tapped on ${item}`)
   }
   const handleDocumentUpload = async () => {
      if (!user) {
         showBottomAlert({
            type: "error",
            title: "Error",
            message: "Please log in to upload documents",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
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
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      const id = toast.loading("Analyzing document...")

      await handleAnalyzeDocument(result.data, selectedDocumentType)

      toast.dismiss(id)
   }

   const handleRecentDocumentPress = (document: AnalysisResponse) => {
      setAnalysisResult(document)
      router.push("/analysisres")
   }

   const handleSpaceClose = () => setSelectedSpace(null)

   return {
      user,
      analysisResult,
      handleItemPress,
      handleDocumentUpload,
      handleAnalyzeResult: handleAnalyzeDocument,
      selectedDocumentType,
      setAnalysisResult,
      setSelectedDocumentType,
      showTextInput,
      setShowTextInput,
      isRecentDocumentsLoading,
      selectedSpace,
      recentDocuments,
      handleSpaceClose,
      handleRecentDocumentPress,
   }
}
