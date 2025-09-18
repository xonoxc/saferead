import React from "react"
import SpaceIcon from "./Icon"

import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { FileText, Trash2, Heart } from "lucide-react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

import type { Space } from "@/types"
import type { SpaceIconName } from "@/constants/spaceform"

const { width } = Dimensions.get("window")

const GRID_ITEM_WIDTH = (width - 40) / 2

interface SpaceListProps {
   space: Space
   viewMode: "list" | "grid"
   onDelete: (id: string, name: string) => void
   onSpaceSelect: (space: Space) => void
}

export const SpaceList: React.FC<SpaceListProps> = ({
   space,
   viewMode,
   onDelete,
   onSpaceSelect,
}) => {
   const { colors } = useTheme()

   if (viewMode === "grid") {
      return (
         <Animated.View entering={FadeIn.duration(500)}>
            <TouchableOpacity
               style={[
                  styles.gridItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
               ]}
               onPress={() => onSpaceSelect(space)}
               activeOpacity={0.8}
            >
               <View style={styles.gridHeader}>
                  <View style={[styles.gridIconContainer, { backgroundColor: `${space.color}20` }]}>
                     <SpaceIcon name={space.icon as SpaceIconName} size={24} color={space.color} />
                  </View>
                  {space.is_favorite && (
                     <Heart size={16} color={colors.warning} fill={colors.warning} />
                  )}
               </View>
               <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={2}>
                  {space.title}
               </Text>
               <View style={styles.gridFooter}>
                  <View style={styles.gridStat}>
                     <FileText size={14} color={colors.textMuted} />
                     <Text style={[styles.gridStatText, { color: colors.textMuted }]}>
                        {space.document_count}
                     </Text>
                  </View>
                  <TouchableOpacity
                     style={styles.deleteButton}
                     onPress={() => onDelete(space.id, space.title)}
                  >
                     <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
               </View>
            </TouchableOpacity>
         </Animated.View>
      )
   }

   return (
      <Animated.View entering={FadeIn.duration(500)} style={styles.listItemContainer}>
         <TouchableOpacity
            style={[styles.listItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onSpaceSelect(space)}
            activeOpacity={0.8}
         >
            <View style={[styles.listIconContainer, { backgroundColor: `${space.color}20` }]}>
               <SpaceIcon name={space.icon as SpaceIconName} size={22} color={space.color} />
            </View>
            <View style={styles.listItemContent}>
               <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={1}>
                  {space.title}
               </Text>
               <Text style={[styles.listSubtitle, { color: colors.textMuted }]}>
                  {space.document_count} documents
               </Text>
            </View>
            <View style={styles.listItemActions}>
               {space.is_favorite && (
                  <Heart size={18} color={colors.warning} fill={colors.warning} />
               )}
               <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(space.id, space.title)}
               >
                  <Trash2 size={18} color={colors.error} />
               </TouchableOpacity>
            </View>
         </TouchableOpacity>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   // Grid Styles
   gridItem: {
      width: GRID_ITEM_WIDTH,
      borderRadius: 16,
      padding: 16,
      margin: 10,
      borderWidth: 1,
      justifyContent: "space-between",
      height: 150,
   },
   gridHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   gridIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
   },
   gridTitle: {
      fontFamily: Fonts.bold,
      fontSize: FontSizes.md,
      marginTop: 12,
   },
   gridFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
   },
   gridStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   gridStatText: {
      fontFamily: Fonts.medium,
      fontSize: FontSizes.sm,
   },

   // List Styles
   listItemContainer: {
      paddingHorizontal: 20,
      marginBottom: 12,
   },
   listItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
   },
   listIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   listItemContent: {
      flex: 1,
   },
   listTitle: {
      fontFamily: Fonts.bold,
      fontSize: FontSizes.lg,
      marginBottom: 2,
   },
   listSubtitle: {
      fontFamily: Fonts.regular,
      fontSize: FontSizes.sm,
   },
   listItemActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
   },

   // Common
   deleteButton: {
      padding: 4,
   },
})
