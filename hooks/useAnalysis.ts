import { router } from "expo-router"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useSpaceStore } from "@/store/useSpaceStore"
import { useDocuments } from "./queries/docs"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { useTabBarVisibilty } from "./useTabBarVisiblitiy"

import type { AnalysisResponse } from "@/types/api/documents.types"

export function useAnalysis() {
   const { user } = useAuth()

   /*
    * all the stores used in this hook
    * ***/
   const analysisResult = useAnalysisStore(s => s.analysisResult)
   const setAnalysisResult = useAnalysisStore(s => s.setAnalysisResult)
   const selectedSpace = useSpaceStore(s => s.selectedSpace)
   const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)

   const selectedDocType = useAnalysisStore(s => s.selectedDocumentType)
   const setSelectedDocType = useAnalysisStore(s => s.setSelectedDocumentType)

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
   const handleRecentDocumentPress = (document: AnalysisResponse) => {
      setAnalysisResult(document)
      router.push("/analysisres")
   }

   const handleSpaceClose = () => setSelectedSpace(null)

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
      selectedSpace,
      recentDocuments,
      handleSpaceClose,
      handleRecentDocumentPress,
   }
}
