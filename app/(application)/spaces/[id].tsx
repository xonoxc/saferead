import React from "react"
import { StyleSheet, View } from "react-native"
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
    pinnedDocuments,
    recentDocuments,
    animatedStyle,
    isSheetVisible,
    isChatBtnVisible,
    isUploadDocFormVisible,
    toggleSheetVisiblity,
    toggleUploadFormVisibilty,
    handleOpenChat,
    handleFavoritePress,
    handleUpdateSpace,
    handleDocumentListScroll,
    handlePinDocumentToSpace: togglePinnedStatus,
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
      <View style={{ flex: 1 }}>
        {/* Pinned Documents */}
        <PinnedDocuments
          documents={pinnedDocuments ?? []}
          colors={colors}
          spaceColor={space.color}
          onUnpinPress={togglePinnedStatus}
        />

        {/* Recent Documents */}
        <SpaceRecentDocumentList
          documents={recentDocuments ?? []}
          colors={colors}
          spaceColor={space.color}
          onPin={togglePinnedStatus}
          onScroll={handleDocumentListScroll}
        />
      </View>

      {/* Open Chat Button */}
      {isChatBtnVisible && (
        <SpaceDetailsOpenChatBtn
          onPress={handleOpenChat}
          color={space.color}
          visibility={isChatBtnVisible}
        />
      )}

      {isUploadDocFormVisible && (
        <UploadDocumentForm
          onCancel={toggleUploadFormVisibilty}
          spaceId={space.id}
          onUploadSuccess={toggleUploadFormVisibilty}
        />
      )}

      {/* Update Space Form */}
      {isSheetVisible && (
        <SpaceForm
          space={space}
          onCancel={toggleSheetVisiblity}
          onCreate={handleUpdateSpace}
          extraContainerStyles={{
            padding: 10,
            paddingHorizontal: 20,
          }}
          useDrawer
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
})
