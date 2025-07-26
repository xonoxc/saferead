import React, { useState } from "react"
import { SideBar } from "@/components/sidebar"
import { useAnalysis } from "@/hooks/useAnalysis"
import { ChatView } from "@/components/chat"
import { Dimensions, View, StyleSheet } from "react-native"
import Animated from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"

import { AnalyzeScreenSkeleton } from "@/components/skeletons"
import AnalyzeHeader from "@/components/analyize/Header"
import AnalyizeDefaultContent from "@/components/analyize/DefaultContent"
import { useSidebarAnimation } from "@/hooks/animation/useSidebarAnimation"

import type { ViewType } from "@/types/view"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

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

  const { mainContentStyle, sidebarStyle } = useSidebarAnimation(isSideBarOpen, SCREEN_WIDTH)

  if (isAnalyzing || isRecentDocumentsLoading)
    return <AnalyzeScreenSkeleton isAnalizing={isAnalyzing} />

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/*SideBar*/}
      <Animated.View
        style={[
          styles.sidebar,
          sidebarStyle,
          { backgroundColor: colors.background, borderRightColor: colors.border },
        ]}
      >
        <SideBar />
      </Animated.View>

      <Animated.View style={[styles.main, mainContentStyle]}>
        {/* Header */}
        <AnalyzeHeader
          selectedSpace={selectedSpace}
          setIsSideBarOpen={setIsSideBarOpen}
          onSpaceExitButtonPress={handleSpaceClose}
          colors={colors}
        />

        {selectedSpace ? (
          <ChatView />
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
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 5,
    bottom: 0,
    width: SCREEN_WIDTH,
  },
  main: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
})
