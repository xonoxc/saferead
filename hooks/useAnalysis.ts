import { router } from "expo-router"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useDocuments } from "./queries/docs"
import { useAnalysisStore } from "@/store/useAnalysisStore"

import type { AnalysisResponse } from "@/types/api/documents.types"

export function useAnalysis() {
   const { user } = useAuth()

   /*
    * all the stores used in this hook
    * ***/
   const analysisResult = useAnalysisStore(s => s.analysisResult)
   const setAnalysisResult = useAnalysisStore(s => s.setAnalysisResult)

   const selectedDocType = useAnalysisStore(s => s.selectedDocumentType)
   const setSelectedDocType = useAnalysisStore(s => s.setSelectedDocumentType)

   const [showTextInput, setShowTextInput] = useState(false)

   const { data, isLoading: isRecentDocumentsLoading } = useDocuments()

   const recentDocuments = data?.pages.flatMap(page => page.results) ?? []

   /*
    *
    * all the handlers below
    * ***/
   const handleItemPress = (item: string) => {
      console.log(`You tapped on ${item}`)
   }
   const handleRecentDocumentPress = (document: AnalysisResponse) => {
      setAnalysisResult(document)
      router.push("/analysisres")
   }

   return {
      user,
      analysisResult,
      handleItemPress,
      selectedDocType,
      setAnalysisResult,
      setSelectedDocType,
      showTextInput,
      setShowTextInput,
      isRecentDocumentsLoading,
      recentDocuments,
      handleRecentDocumentPress,
   }
}
