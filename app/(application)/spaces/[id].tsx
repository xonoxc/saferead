import React from "react"
import { View, StyleSheet } from "react-native"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { UploadDocumentForm } from "@/components/spaces/UploadDocumentForm"
import { useSpaceDetailsScreen } from "@/hooks/screens/useSpaceDetailScreen"
import { useTheme } from "@/hooks/useTheme"
import SpaceDetailHeader from "@/components/spaces/SpaceDetails/SpaceDetailsHeader"
import SpaceDetailsStats from "@/components/spaces/SpaceDetails/SpaceDetailsStats"
import SpaceRecentDocumentList from "@/components/spaces/SpaceDetails/SpaceRecentDocumentList"
import SpaceDetailsOpenChatBtn from "@/components/spaces/SpaceDetails/SpaceDetailsOpenChatBtn"

export default function SpaceDetailScreen() {
  const { colors } = useTheme()

  const {
    space,
    stats,
    animatedStyle,
    isSheetVisible,
    setSheetVisible,
    handleBottomSheetClose,
    handleOpenChat,
    handleFavoritePress,
  } = useSpaceDetailsScreen({ colors })

  if (!space) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SpaceDetailHeader
        animatedStyle={animatedStyle}
        space={space}
        onFavoritePress={handleFavoritePress}
        onCreateBtnPress={() => setSheetVisible(true)}
      />

      {/* Stats */}
      <SpaceDetailsStats stats={stats} colors={colors} />

      {/* Recent Documents */}
      <SpaceRecentDocumentList documents={space.recent_documents} colors={colors} />

      {/* Open Chat Button */}
      <SpaceDetailsOpenChatBtn onPress={handleOpenChat} />

      {/* Upload Document Button */}
      {isSheetVisible && (
        <View style={styles.modalOverlay}>
          <UploadDocumentForm
            spaceId={space.id}
            onCancel={handleBottomSheetClose}
            onUploadSuccess={handleBottomSheetClose}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  modalOverlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    zIndex: 100,
  },
})
