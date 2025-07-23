import React from "react"
import { View, StyleSheet } from "react-native"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useSpaceDetailsScreen } from "@/hooks/screens/useSpaceDetailScreen"
import { useTheme } from "@/hooks/useTheme"
import SpaceDetailHeader from "@/components/spaces/SpaceDetails/SpaceDetailsHeader"
import SpaceDetailsStats from "@/components/spaces/SpaceDetails/SpaceDetailsStats"
import SpaceRecentDocumentList from "@/components/spaces/SpaceDetails/SpaceRecentDocumentList"
import SpaceDetailsOpenChatBtn from "@/components/spaces/SpaceDetails/SpaceDetailsOpenChatBtn"
import { SpaceForm } from "@/components/spaces/SpaceForm"
import { UploadDocumentForm } from "@/components/spaces/UploadDocumentForm"

export default function SpaceDetailScreen() {
  const { colors } = useTheme()

  const {
    space,
    stats,
    animatedStyle,
    isSheetVisible,
    isUploadDocFormVisible,
    toggleSheetVisiblity,
    toggleUploadFormVisibilty,
    handleOpenChat,
    handleFavoritePress,
    handleUpdateSpace,
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
        onCreateBtnPress={toggleUploadFormVisibilty}
        onSettingsPress={toggleSheetVisiblity}
      />

      {/* Stats */}
      <SpaceDetailsStats stats={stats} colors={colors} />

      {/* Recent Documents */}
      <SpaceRecentDocumentList
        documents={space.recent_documents}
        colors={colors}
        spaceColor={space.color}
      />

      {/* Open Chat Button */}
      <SpaceDetailsOpenChatBtn onPress={handleOpenChat} color={space.color} />

      {isUploadDocFormVisible && (
        <UploadDocumentForm
          onCancel={toggleUploadFormVisibilty}
          spaceId={space.id}
          onUploadSuccess={toggleUploadFormVisibilty}
        />
      )}

      {/* Update Space Form */}
      {isSheetVisible && (
        <View style={styles.modalOverlay}>
          <SpaceForm
            space={space}
            onCancel={toggleSheetVisiblity}
            onCreate={handleUpdateSpace}
            useDrawer={true}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    zIndex: 900,
  },
})
