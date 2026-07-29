import React from "react"
import { View } from "react-native"

import { useAnalysis } from "@/hooks/useAnalysis"
import { useTheme } from "@/hooks/useTheme"
import { useDocumentStats } from "@/hooks/useDocumentStats"

import { AnalyzeScreenSkeleton } from "@/components/skeletons"
import { AnalyticsPanel } from "@/components/analyize/AnalyticsPanel"
import { AnalysisFeed } from "@/components/analyize/AnalysisFeed"

/*
 * Scan history.
 *
 * This screen used to be two screens wearing one route: the analysis feed, and
 * — whenever a space happened to be selected — the whole chat UI instead. Chat
 * now has its own tab, so this is only ever the feed.
 * **/
export default function AnalyzeScreen() {
   const { colors } = useTheme()

   const { recentDocuments, handleRecentDocumentPress, isRecentDocumentsLoading } = useAnalysis()

   const { stats } = useDocumentStats()

   if (isRecentDocumentsLoading) return <AnalyzeScreenSkeleton />

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
         <AnalyticsPanel colors={colors} stats={stats} />
         <AnalysisFeed
            colors={colors}
            documents={recentDocuments}
            onDocumentPress={handleRecentDocumentPress}
         />
      </View>
   )
}
