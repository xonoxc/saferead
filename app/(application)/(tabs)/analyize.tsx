import React, { useState } from "react"
import { SideBar } from "@/components/sidebar"
import { useAnalysis } from "@/hooks/useAnalysis"
import { ChatView } from "@/components/chat"
import { View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"

import { AnalyzeScreenSkeleton } from "@/components/skeletons"
import type { ViewType } from "@/types/view"
import AnalyzeHeader from "@/components/analyize/Header"
import AnalyizeDefaultContent from "@/components/analyize/DefaultContent"

export default function AnalyzeScreen() {
  const { colors } = useTheme()
  const [viewType, setViewType] = useState<ViewType>("list")

  const {
    isSideBarOpen,
    setIsSideBarOpen,
    isAnalyzing,
    handleDocumentUpload,
    handleDocumentScan,
    selectedDocumentType,
    setSelectedDocumentType,
    recentDocuments,
    handleRecentDocumentPress,
    selectedSpace,
    isRecentDocumentsLoading,
    handleSpaceClose,
  } = useAnalysis()

  if (isAnalyzing || isRecentDocumentsLoading)
    return <AnalyzeScreenSkeleton isAnalizing={isAnalyzing} />

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/*SideBar*/}
      <SideBar isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />

      {/* Header */}
      <AnalyzeHeader
        setIsSideBarOpen={setIsSideBarOpen}
        onSpaceExitButtonPress={handleSpaceClose}
        colors={colors}
      />

      {selectedSpace ? (
        <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
          {/* Chat View */}
          <ChatView space={selectedSpace} />
        </Animated.View>
      ) : (
        <AnalyizeDefaultContent
          colors={colors}
          ViewType={viewType}
          recentDocuments={recentDocuments}
          selectedDocType={selectedDocumentType}
          onSetViewType={setViewType}
          onDocumentScan={handleDocumentScan}
          onDocumentUpload={handleDocumentUpload}
          onDocumentSelectType={setSelectedDocumentType}
          onRecentDocumentPress={handleRecentDocumentPress}
        />
      )}
    </View>
  )
}
