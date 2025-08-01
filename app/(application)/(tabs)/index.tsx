import React from "react"
import { ScrollView, RefreshControl } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useDocumentStats } from "@/hooks/useDocumentStats"
import { useTabHideScroll } from "@/hooks/useTabHideScroll"

import { HomeScreenSkeleton } from "@/components/skeletons"
import HomeScreenErrorFallback from "@/components/home/HomeScreenErrorFallback"
import { HomeScreenMainStats } from "@/components/home/HomeMainStats"
import HomeScreenDocumentType from "@/components/home/HomeScreenDocumentTypes"
import HomeScreenStatsProcessingStatus from "@/components/home/HomeScreenStatsProcessingStatus"
import HomeScreenHeader from "@/components/home/HomeScreenHeader"

import type { StatsResponse } from "@/types/api/documents.types"
import HomeScreenDocPendingStatus from "@/components/home/HomeScreenDocPendingStatus"

export default function HomeScreen() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { stats, isLoading, error, refetch, isRefetching } = useDocumentStats()
  const { handleScroll } = useTabHideScroll()

  if (isLoading || isRefetching) {
    return <HomeScreenSkeleton />
  }

  if (error) {
    return <HomeScreenErrorFallback error={error} colors={colors} />
  }

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={{
        flex: 1,
        paddingVertical: 20,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={{ paddingBottom: 120 }}
      bounces
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          colors={[colors.text]}
          progressBackgroundColor={colors.background}
        />
      }
    >
      <HomeScreenHeader colors={colors} user={user} />

      {/* Main Statistics */}
      <HomeScreenMainStats stats={stats as StatsResponse} />

      {/* Document Types */}
      <HomeScreenDocumentType stats={stats as StatsResponse} />

      {/* Processing Status */}
      <HomeScreenStatsProcessingStatus stats={stats as StatsResponse} />

      {/* Pending Documents */}
      <HomeScreenDocPendingStatus stats={stats as StatsResponse} />
    </ScrollView>
  )
}
