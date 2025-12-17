import React from "react"
import Animated from "react-native-reanimated"
import SpaceDetailHeader from "@/components/spaces/SpaceDetails/SpaceDetailsHeader"
import SpaceDetailsStats from "@/components/spaces/SpaceDetails/SpaceDetailsStats"
import SpaceDetailsOpenChatBtn from "@/components/spaces/SpaceDetails/SpaceDetailsOpenChatBtn"

import { SectionList, StyleSheet, View, Text } from "react-native"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpaceForm } from "@/components/spaces/SpaceForm"
import { UploadDocumentForm } from "@/components/spaces/UploadDocumentForm"
import { UserSpaceDocumentCard } from "@/components/documents/UserSpaceDocumentCard"

import { useSpaceDetailsScreen } from "@/hooks/screens/useSpaceDetailScreen"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"
import { getSections } from "@/components/spaces/SpaceDetails/getSections"

import type { SpaceItem, SpaceSection } from "@/types/screens/spacedetailtscreen"
import SpaceDetailTopBar from "@/components/spaces/SpaceDetails/SpaceDetailTopToolbar"

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList<SpaceItem, SpaceSection>)

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

   const sections = getSections(stats, pinnedDocuments, recentDocuments)

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <SpaceDetailTopBar
            animatedStyle={animatedStyle}
            space={space}
            onFavoritePress={handleFavoritePress}
            onCreateBtnPress={toggleUploadFormVisibilty}
            onSettingsPress={toggleSheetVisiblity}
         />

         <AnimatedSectionList
            sections={sections}
            stickySectionHeadersEnabled
            showsVerticalScrollIndicator={false}
            onScroll={handleDocumentListScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item, index) => {
               if (item.kind === "document") return item.id
               return `${item.kind}-${index}`
            }}
            renderSectionHeader={({ section }) => {
               switch (section.type) {
                  case "documents":
                     if (!section.data.length) return null

                     return (
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                           {section.title}
                        </Text>
                     )

                  default:
                     return null
               }
            }}
            renderItem={({ item, section }) => {
               switch (item.kind) {
                  case "topbar":
                     return <View style={{ height: 1 }} />

                  case "stats":
                     return (
                        <>
                           <SpaceDetailHeader
                              animatedStyle={animatedStyle}
                              space={space}
                              onFavoritePress={handleFavoritePress}
                              onCreateBtnPress={toggleUploadFormVisibilty}
                              onSettingsPress={toggleSheetVisiblity}
                           />
                           <SpaceDetailsStats stats={item.stats} colors={colors} />
                        </>
                     )

                  case "document":
                     return (
                        <UserSpaceDocumentCard
                           document={item}
                           pinned={section.type === "documents" && section.pinned}
                           spaceColor={space.color}
                           onPin={togglePinnedStatus}
                        />
                     )
               }
            }}
         />

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
   listContent: {
      paddingBottom: 130,
   },
   sectionTitle: {
      paddingHorizontal: 20,
      marginTop: 16,
      marginBottom: 10,
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
})
