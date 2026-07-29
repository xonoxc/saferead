import { useState } from "react"
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native"
import { MessagesSquare, FileText, Plus, ChevronRight, ChevronLeft } from "lucide-react-native"
import { router } from "expo-router"

import { useTheme } from "@/hooks/useTheme"
import { useSpaces } from "@/hooks/queries/spaces"
import { useSpaceStore } from "@/store/useSpaceStore"
import { Fonts, Spacing, Radii, Type, TAB_BAR_CLEARANCE, elevation, withAlpha } from "@/constants"
import { ChatView } from "@/components/chat"
import { SpaceIndicator } from "@/components/chat/spaceindicator/SpaceIndicator"
import { FadeInView, PressableScale } from "@/components/motion"
import SpaceIcon from "@/components/spaces/Icon"
import SearchBar from "@/components/search/SearchBar"
import { SettingsButton } from "@/components/settings/SettingsButton"

import type { Space } from "@/types"
import type { SpaceIconName } from "@/constants/spaceform"

/*
 * Chat, as a place rather than a mode.
 *
 * It used to live inside the scan-history tab and only appear once a space had
 * been selected somewhere else, which meant the assistant had no address: you
 * could not get to it, only end up in it. On its own tab it needs to answer
 * "which space am I talking to?" itself — hence the picker below, and the pill
 * in the header that switches spaces without leaving the conversation.
 * **/
export default function ChatScreen() {
   const { colors } = useTheme()
   const selectedSpace = useSpaceStore(s => s.selectedSpace)
   const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         {selectedSpace ? (
            <>
               <View style={[styles.chatHeader, { borderBottomColor: colors.border }]}>
                  {/*
                   * The pill switches spaces; this clears the choice entirely
                   * and returns to the picker. Without it the picker would be
                   * reachable exactly once per install — the pill can only ever
                   * move you sideways to another space, never back out.
                   * **/}
                  <Pressable
                     onPress={() => setSelectedSpace(null)}
                     hitSlop={10}
                     style={styles.headerBack}
                     accessibilityRole="button"
                     accessibilityLabel="Choose a different space"
                  >
                     <ChevronLeft size={22} color={colors.textMuted} strokeWidth={2.2} />
                  </Pressable>

                  <SpaceIndicator />

                  <SettingsButton />
               </View>

               <ChatView />
            </>
         ) : (
            <SpacePicker />
         )}
      </View>
   )
}

/*
 * Which space to talk to.
 *
 * A space is the unit of retrieval — the assistant answers from the documents
 * inside one — so this is a required choice, not a filter. The document count
 * is on every row because a space with nothing in it can only answer generally,
 * and finding that out after typing a question is a waste of the question.
 * **/
function SpacePicker() {
   const { colors } = useTheme()
   const setSelectedSpace = useSpaceStore(s => s.setSelectedSpace)
   const [search, setSearch] = useState("")

   const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSpaces()

   const spaces = data?.pages.flatMap(page => page.results) ?? []
   const visible = search.trim()
      ? spaces.filter(s => s.title.toLowerCase().includes(search.trim().toLowerCase()))
      : spaces

   return (
      <View style={styles.container}>
         <FadeInView delay={80} style={styles.header}>
            <View style={styles.headerText}>
               <Text style={[styles.eyebrow, { color: colors.textMuted }]}>ASSISTANT</Text>
               <Text style={[styles.title, { color: colors.text }]}>Chat</Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Pick a space to ask questions about the documents inside it.
               </Text>
            </View>

            <SettingsButton />
         </FadeInView>

         <View style={styles.searchRow}>
            <SearchBar
               searchQuery={search}
               onSearchChange={setSearch}
               placeholder="Search spaces..."
            />
         </View>

         {isLoading ? (
            <ActivityIndicator style={styles.loader} color={colors.primary} />
         ) : (
            <FlatList
               data={visible}
               keyExtractor={item => item.id}
               contentContainerStyle={[
                  styles.list,
                  visible.length === 0 && styles.listEmpty,
                  { paddingBottom: TAB_BAR_CLEARANCE },
               ]}
               showsVerticalScrollIndicator={false}
               keyboardShouldPersistTaps="handled"
               renderItem={({ item, index }) => (
                  <FadeInView index={index}>
                     <SpaceRow space={item} onPress={() => setSelectedSpace(item)} />
                  </FadeInView>
               )}
               onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
               onEndReachedThreshold={0.4}
               ListFooterComponent={
                  isFetchingNextPage ? (
                     <ActivityIndicator style={styles.loader} color={colors.textMuted} />
                  ) : null
               }
               ListEmptyComponent={<PickerEmpty hasSearch={!!search.trim()} />}
            />
         )}
      </View>
   )
}

function SpaceRow({ space, onPress }: { space: Space; onPress: () => void }) {
   const { colors } = useTheme()

   return (
      <PressableScale
         onPress={onPress}
         accessibilityRole="button"
         accessibilityLabel={`Chat with ${space.title}`}
         style={StyleSheet.flatten([
            styles.row,
            { backgroundColor: colors.card, borderColor: colors.border },
            elevation(colors, 1),
         ])}
      >
         <View style={[styles.rowIcon, { backgroundColor: withAlpha(space.color, 0.14) }]}>
            <SpaceIcon name={space.icon as SpaceIconName} size={20} color={space.color} />
         </View>

         <View style={styles.rowText}>
            <Text numberOfLines={1} style={[styles.rowTitle, { color: colors.text }]}>
               {space.title}
            </Text>

            <View style={styles.rowMeta}>
               <FileText size={12} color={colors.textMuted} strokeWidth={2.2} />
               <Text style={[styles.rowMetaText, { color: colors.textMuted }]}>
                  {space.document_count === 1
                     ? "1 document"
                     : `${space.document_count} documents`}
               </Text>
            </View>
         </View>

         <ChevronRight size={18} color={colors.textMuted} strokeWidth={2.2} />
      </PressableScale>
   )
}

function PickerEmpty({ hasSearch }: { hasSearch: boolean }) {
   const { colors } = useTheme()

   return (
      <View style={styles.empty}>
         <View style={[styles.emptyIcon, { backgroundColor: withAlpha(colors.primary, 0.1) }]}>
            <MessagesSquare size={24} color={colors.primary} strokeWidth={2} />
         </View>

         <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {hasSearch ? "No matching space" : "No spaces yet"}
         </Text>
         <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            {hasSearch
               ? "Try a different name, or create a space for these documents."
               : "A space groups documents so the assistant can answer from them."}
         </Text>

         <Pressable
            onPress={() => router.push("/(application)/(tabs)/spaces")}
            style={[styles.emptyAction, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
         >
            <Plus size={16} color={colors.onPrimary} strokeWidth={2.6} />
            <Text style={[styles.emptyActionText, { color: colors.onPrimary }]}>
               Go to Spaces
            </Text>
         </Pressable>
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   chatHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
   },
   headerBack: {
      width: 32,
      alignItems: "flex-start",
      justifyContent: "center",
   },
   header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.sm,
   },
   headerText: { flex: 1, gap: 2 },
   eyebrow: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   subtitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      marginTop: 2,
   },
   searchRow: { paddingHorizontal: Spacing.lg },
   loader: { paddingVertical: Spacing.lg },
   list: {
      paddingHorizontal: Spacing.lg,
      gap: Spacing.xs,
   },
   listEmpty: { flexGrow: 1, justifyContent: "center" },
   row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.sm,
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
   },
   rowIcon: {
      width: 40,
      height: 40,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   rowText: { flex: 1, gap: 2 },
   rowTitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   rowMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   rowMetaText: {
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   empty: {
      alignItems: "center",
      paddingHorizontal: Spacing.lg,
      gap: Spacing.xs,
   },
   emptyIcon: {
      width: 52,
      height: 52,
      borderRadius: Radii.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.xs,
   },
   emptyTitle: {
      ...Type.subheading,
      fontFamily: Fonts.semiBold,
   },
   emptyBody: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
   emptyAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: Radii.sm,
      marginTop: Spacing.sm,
   },
   emptyActionText: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
})
