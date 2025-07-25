import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useSpaceDetailsScreen } from "@/hooks/screens/useSpaceDetailScreen"
import { useTheme } from "@/hooks/useTheme"
import SpaceDetailHeader from "@/components/spaces/SpaceDetails/SpaceDetailsHeader"
import SpaceDetailsStats from "@/components/spaces/SpaceDetails/SpaceDetailsStats"
import SpaceRecentDocumentList from "@/components/spaces/SpaceDetails/SpaceRecentDocumentList"
import SpaceDetailsOpenChatBtn from "@/components/spaces/SpaceDetails/SpaceDetailsOpenChatBtn"
import { SpaceForm } from "@/components/spaces/SpaceForm"
import { UploadDocumentForm } from "@/components/spaces/UploadDocumentForm"
import PinnedDocuments from "@/components/spaces/SpaceDetails/PinnedDocuments"

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
    handlePinDocumentToSpace,
  } = useSpaceDetailsScreen({ colors })

  if (!space) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </View>
    )
  }

  const pinnedDocuments = space.recent_documents.filter(doc => doc.is_pinned)
  const recentDocuments = space.recent_documents.filter(doc => !doc.is_pinned)

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
      <View style={{ flex: 1 }}>
        {/* Pinned Documents */}
        <PinnedDocuments documents={pinnedDocuments} colors={colors} spaceColor={space.color} />

        {/* Recent Documents */}
        <SpaceRecentDocumentList
          documents={recentDocuments}
          colors={colors}
          spaceColor={space.color}
          onPin={handlePinDocumentToSpace}
        />
      </View>

      {/* Open Chat Button */}
      <SpaceDetailsOpenChatBtn onPress={handleOpenChat} color={space.color} />

      {isUploadDocFormVisible && (
        <View style={styles.modalOverlay}>
          <UploadDocumentForm
            onCancel={toggleUploadFormVisibilty}
            spaceId={space.id}
            onUploadSuccess={toggleUploadFormVisibilty}
          />
        </View>
      )}

      {/* Update Space Form */}
      {isSheetVisible && (
        <SpaceForm space={space} onCancel={toggleSheetVisiblity} onCreate={handleUpdateSpace} />
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 900,
  },
})
