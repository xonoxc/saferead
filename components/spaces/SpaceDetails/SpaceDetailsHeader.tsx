import React from "react"
import SpaceIcon from "@/components/spaces/Icon"

import { View, StyleSheet, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "@/hooks/useTheme"

import { Fonts, FontSizes } from "@/constants"
import { Spacing, Radii, withAlpha } from "@/constants/Design"
import { FadeInView } from "@/components/motion"

import type { Space } from "@/types"

export interface HeaderProps {
   space: Space
   onCreateBtnPress: () => void
   animatedStyle: {
      transform: {
         scale: number
      }[]
   }
   onFavoritePress: () => void
   onSettingsPress: () => void
}

/*
 * Space identity block.
 *
 * The space colour appears as a soft gradient wash and on the icon tile only,
 * so the title and description keep theme text colours and stay legible on any
 * space colour. Previously the description was drawn in colors.background over
 * the raw space colour, which vanished on pale colours.
 * **/
export default function SpaceDetailHeader(props: HeaderProps) {
   const { colors } = useTheme()
   const { space } = props

   return (
      <FadeInView delay={40} style={styles.header}>
         <LinearGradient
            colors={[withAlpha(space.color, 0.18), withAlpha(space.color, 0.02)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.spaceInfo, { borderColor: colors.border }]}
         >
            <View
               style={[
                  styles.spaceIconLarge,
                  {
                     backgroundColor: colors.card,
                     borderColor: withAlpha(space.color, 0.25),
                  },
               ]}
            >
               <SpaceIcon name={space.icon} color={space.color} size={34} />
            </View>

            <View style={styles.spaceMeta}>
               <Text style={[styles.spaceTitle, { color: colors.text }]} numberOfLines={2}>
                  {space.title}
               </Text>
               <Text
                  style={[styles.spaceDescription, { color: colors.textSecondary }]}
                  numberOfLines={2}
               >
                  {space.description || "No description provided"}
               </Text>
               <Text style={[styles.spaceDate, { color: colors.textMuted }]}>
                  Created {new Date(space.created_at).toLocaleDateString()}
               </Text>
            </View>
         </LinearGradient>
      </FadeInView>
   )
}

const styles = StyleSheet.create({
   header: {
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.md,
   },
   spaceInfo: {
      flexDirection: "row",
      padding: Spacing.md,
      borderRadius: Radii.lg,
      alignItems: "center",
      width: "100%",
      borderWidth: 1,
   },
   spaceIconLarge: {
      width: 62,
      height: 62,
      borderRadius: Radii.md,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.md,
      borderWidth: 1,
   },
   spaceMeta: {
      flex: 1,
   },
   spaceTitle: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
      marginBottom: 3,
   },
   spaceDescription: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      marginBottom: Spacing.xxs,
      lineHeight: 19,
   },
   spaceDate: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
})
