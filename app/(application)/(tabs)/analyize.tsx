import React, { useState } from "react"
import { SideBar } from "@/components/sidebar"
import { useAnalysis } from "@/hooks/useAnalysis"
import { ChatView } from "@/components/chat"
import { Dimensions, View, StyleSheet } from "react-native"
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"

import { AnalyzeScreenSkeleton } from "@/components/skeletons"
import type { ViewType } from "@/types/view"
import AnalyzeHeader from "@/components/analyize/Header"
import AnalyizeDefaultContent from "@/components/analyize/DefaultContent"

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

  const translateX = useSharedValue(-SCREEN_WIDTH)

  React.useEffect(() => {
    translateX.value = withTiming(isSideBarOpen ? 0 : -SCREEN_WIDTH, {
      duration: 400,
      easing: Easing.out(Easing.ease),
      reduceMotion: ReduceMotion.System,
    })
  }, [isSideBarOpen, translateX])

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  const mainContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + SCREEN_WIDTH }],
  }))

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
          <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
            {/* Chat View */}
            <ChatView />
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
