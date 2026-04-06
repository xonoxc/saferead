import React, { useState } from "react"
import { useAnalysis } from "@/hooks/useAnalysis"
import { ChatView } from "@/components/chat"
import { View } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { useDocumentStats } from "@/hooks/useDocumentStats"

import { AnalyzeScreenSkeleton } from "@/components/skeletons"
import AnalyzeHeader from "@/components/analyize/Header"
import { AnalyticsPanel } from "@/components/analyize/AnalyticsPanel"
import { AnalysisFeed } from "@/components/analyize/AnalysisFeed"

import type { ViewType } from "@/types/view"

export default function AnalyzeScreen() {
   const { colors, isDark } = useTheme()
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

   const { stats } = useDocumentStats()

   if (isRecentDocumentsLoading) return <AnalyzeScreenSkeleton />

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            <View style={{ flex: 1 }}>
               <AnalyticsPanel colors={colors} stats={stats} />
               <AnalysisFeed
                  colors={colors}
                  documents={recentDocuments}
                  onDocumentPress={handleRecentDocumentPress}
               />
            </View>
         )}
      </View>
   )
}
