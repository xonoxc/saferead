import React from "react"
import SpaceIcon from "./Icon"

import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native"
import { FileText, Trash2, Heart, MessagesSquare } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Spacing, Radii, elevation, withAlpha } from "@/constants/Design"
import { FadeInView, PressableScale } from "@/components/motion"

import type { SpaceIconName } from "@/constants/spaceform"
import type { SpaceListProps } from "@/components/spaces/SpaceList"
import type { ColorsType } from "@/hooks/useTheme"

const { width } = Dimensions.get("window")

const GRID_GUTTER = Spacing.md
const GRID_ITEM_WIDTH = (width - GRID_GUTTER * 3) / 2

type SpaceListViewProps = Omit<SpaceListProps, "viewMode"> & {
   colors: ColorsType
   index?: number
}

/*
 * A space's own colour is used as a soft wash behind its icon and as a top
 * accent bar, so a list of spaces stays visually distinguishable at a glance
 * without any one card shouting.
 * **/

export function SpaceListView({
   space,
   colors,
   onDelete,
   onSpaceSelect,
   index = 0,
}: SpaceListViewProps) {
   return (
      <FadeInView index={index} style={styles.listItemContainer}>
         <PressableScale
            style={[
               styles.listItem,
               { backgroundColor: colors.card, borderColor: colors.border },
               elevation(colors, 1),
            ]}
            onPress={() => onSpaceSelect(space)}
            accessibilityRole="button"
            accessibilityLabel={`Open space ${space.title}`}
         >
            <View
               style={[styles.listIconContainer, { backgroundColor: withAlpha(space.color, 0.14) }]}
            >
               <SpaceIcon name={space.icon as SpaceIconName} size={22} color={space.color} />
            </View>

            <View style={styles.listItemContent}>
               <View style={styles.titleRow}>
                  <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={1}>
                     {space.title}
                  </Text>
                  {space.is_favorite && (
                     <Heart size={14} color={colors.warning} fill={colors.warning} />
                  )}
               </View>

               {!!space.description && (
                  <Text
                     style={[styles.listDescription, { color: colors.textMuted }]}
                     numberOfLines={1}
                  >
                     {space.description}
                  </Text>
               )}

               <View style={styles.metaRow}>
                  <MetaChip
                     icon={<FileText size={12} color={colors.textMuted} />}
                     label={countLabel(space.document_count, "document")}
                     colors={colors}
                  />
                  {space.conversation_count > 0 && (
                     <MetaChip
                        icon={<MessagesSquare size={12} color={colors.textMuted} />}
                        label={countLabel(space.conversation_count, "chat")}
                        colors={colors}
                     />
                  )}
               </View>
            </View>

            <Pressable
               style={styles.deleteButton}
               onPress={() => onDelete(space.id, space.title)}
               hitSlop={10}
               accessibilityRole="button"
               accessibilityLabel={`Delete space ${space.title}`}
            >
               <Trash2 size={17} color={colors.textMuted} />
            </Pressable>
         </PressableScale>
      </FadeInView>
   )
}

export function SpaceListGrid({
   space,
   colors,
   onDelete,
   onSpaceSelect,
   index = 0,
}: SpaceListViewProps) {
   return (
      <FadeInView index={index} style={styles.gridItemContainer}>
         <PressableScale
            style={[
               styles.gridItem,
               { backgroundColor: colors.card, borderColor: colors.border },
               elevation(colors, 1),
            ]}
            onPress={() => onSpaceSelect(space)}
            accessibilityRole="button"
            accessibilityLabel={`Open space ${space.title}`}
         >
            {/* Colour band ties the card to the space without tinting the whole surface */}
            <View style={[styles.gridAccent, { backgroundColor: space.color }]} />

            <View style={styles.gridHeader}>
               <View
                  style={[
                     styles.gridIconContainer,
                     { backgroundColor: withAlpha(space.color, 0.14) },
                  ]}
               >
                  <SpaceIcon name={space.icon as SpaceIconName} size={22} color={space.color} />
               </View>
               {space.is_favorite && (
                  <Heart size={15} color={colors.warning} fill={colors.warning} />
               )}
            </View>

            <View style={styles.gridBody}>
               <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={2}>
                  {space.title}
               </Text>
               {!!space.description && (
                  <Text
                     style={[styles.gridDescription, { color: colors.textMuted }]}
                     numberOfLines={2}
                  >
                     {space.description}
                  </Text>
               )}
            </View>

            <View style={[styles.gridFooter, { borderTopColor: colors.borderLight }]}>
               <View style={styles.gridStat}>
                  <FileText size={13} color={colors.textMuted} />
                  <Text style={[styles.gridStatText, { color: colors.textMuted }]}>
                     {space.document_count}
                  </Text>
                  {space.conversation_count > 0 && (
                     <>
                        <MessagesSquare
                           size={13}
                           color={colors.textMuted}
                           style={styles.gridStatSpacer}
                        />
                        <Text style={[styles.gridStatText, { color: colors.textMuted }]}>
                           {space.conversation_count}
                        </Text>
                     </>
                  )}
               </View>

               <Pressable
                  style={styles.deleteButton}
                  onPress={() => onDelete(space.id, space.title)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete space ${space.title}`}
               >
                  <Trash2 size={15} color={colors.textMuted} />
               </Pressable>
            </View>
         </PressableScale>
      </FadeInView>
   )
}

function MetaChip({
   icon,
   label,
   colors,
}: {
   icon: React.ReactNode
   label: string
   colors: ColorsType
}) {
   return (
      <View style={[styles.metaChip, { backgroundColor: colors.surface }]}>
         {icon}
         <Text style={[styles.metaChipText, { color: colors.textMuted }]}>{label}</Text>
      </View>
   )
}

function countLabel(count: number, noun: string) {
   return `${count} ${noun}${count === 1 ? "" : "s"}`
}

const styles = StyleSheet.create({
   // Grid
   gridItemContainer: {
      width: GRID_ITEM_WIDTH,
      marginLeft: GRID_GUTTER,
      marginBottom: GRID_GUTTER,
   },
   gridItem: {
      borderRadius: Radii.lg,
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.sm,
      paddingBottom: Spacing.xs,
      borderWidth: 1,
      minHeight: 172,
      justifyContent: "space-between",
      overflow: "hidden",
   },
   gridAccent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 3,
   },
   gridHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   gridIconContainer: {
      width: 40,
      height: 40,
      borderRadius: Radii.sm,
      justifyContent: "center",
      alignItems: "center",
   },
   gridBody: {
      flex: 1,
      marginTop: Spacing.sm,
   },
   gridTitle: {
      fontFamily: Fonts.semiBold,
      fontSize: FontSizes.md,
   },
   gridDescription: {
      fontFamily: Fonts.regular,
      fontSize: FontSizes.xs,
      marginTop: Spacing.xxs,
      lineHeight: 17,
   },
   gridFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: Spacing.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
   },
   gridStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xxs,
   },
   gridStatSpacer: {
      marginLeft: Spacing.xs,
   },
   gridStatText: {
      fontFamily: Fonts.medium,
      fontSize: FontSizes.xs,
   },

   // List
   listItemContainer: {
      paddingHorizontal: Spacing.md,
      marginBottom: Spacing.sm,
   },
   listItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.sm,
      borderRadius: Radii.md,
      borderWidth: 1,
   },
   listIconContainer: {
      width: 46,
      height: 46,
      borderRadius: Radii.sm,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.sm,
   },
   listItemContent: {
      flex: 1,
      gap: 2,
   },
   titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xxs,
   },
   listTitle: {
      fontFamily: Fonts.semiBold,
      fontSize: FontSizes.md,
      flexShrink: 1,
   },
   listDescription: {
      fontFamily: Fonts.regular,
      fontSize: FontSizes.xs,
   },
   metaRow: {
      flexDirection: "row",
      gap: Spacing.xxs,
      marginTop: Spacing.xxs,
   },
   metaChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xxs,
      paddingHorizontal: Spacing.xs,
      paddingVertical: 3,
      borderRadius: Radii.pill,
   },
   metaChipText: {
      fontFamily: Fonts.medium,
      fontSize: 11,
   },

   deleteButton: {
      padding: Spacing.xxs,
   },
})
