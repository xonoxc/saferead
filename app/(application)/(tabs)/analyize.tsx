import React, { useState } from "react"
import { useAnalysis } from "@/hooks/useAnalysis"
import { ChatView } from "@/components/chat"
import { View } from "react-native"
import { useTheme } from "@/hooks/useTheme"

import { AnalyzeScreenSkeleton } from "@/components/skeletons"
import AnalyzeHeader from "@/components/analyize/Header"
import AnalyizeDefaultContent from "@/components/analyize/DefaultContent"

import type { ViewType } from "@/types/view"

export default function AnalyzeScreen() {
   const { colors } = useTheme()
   const [viewType, setViewType] = useState<ViewType>("list")

   const {
      selectedDocType,
      setSelectedDocType,
      recentDocuments,
      handleRecentDocumentPress,
      selectedSpace,
      isRecentDocumentsLoading,
      handleSpaceClose,
   } = useAnalysis()

   if (isRecentDocumentsLoading) return <AnalyzeScreenSkeleton />

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
         {/* Header */}
         {/* hamburder menu ---  upgrade button  --- exit button is space is selected */}
         {selectedSpace && (
            <AnalyzeHeader
               selectedSpace={selectedSpace}
               onSpaceExitButtonPress={handleSpaceClose}
               colors={colors}
            />
         )}
         {selectedSpace ? (
            <ChatView />
         ) : (
            <AnalyizeDefaultContent
               colors={colors}
               viewType={{
                  value: viewType,
                  onChange: setViewType,
               }}
               recentDocuments={recentDocuments}
               selectedDocType={selectedDocType}
               onDocumentSelectType={setSelectedDocType}
               onRecentDocumentPress={handleRecentDocumentPress}
            />
         )}
      </View>
   )
}
