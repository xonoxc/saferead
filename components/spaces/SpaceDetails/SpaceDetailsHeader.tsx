import React from "react"
import SpaceIcon from "@/components/spaces/Icon"

import { View, StyleSheet, Text } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"

import { Fonts, FontSizes } from "@/constants"

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

export default function SpaceDetailHeader(props: HeaderProps) {
   const { colors } = useTheme()
   const { space } = props

   return (
      <Animated.View
         entering={FadeInDown.delay(100).springify()}
         style={[styles.header, { backgroundColor: colors.background }]}
      >
         <View style={[styles.spaceInfo, { backgroundColor: space.color }]}>
            <View
               style={[
                  styles.spaceIconLarge,
                  {
                     backgroundColor: colors.background,
                  },
               ]}
            >
               <SpaceIcon name={space.icon} color={space.color} size={50} />
            </View>

            <View style={styles.spaceMeta}>
               <Text style={[styles.spaceTitle, { color: colors.text }]}>{space.title}</Text>
               <Text style={[styles.spaceDescription, { color: colors.background }]}>
                  {space.description ?? "No description provided"}
               </Text>
               <Text
                  style={[
                     styles.spaceDate,
                     {
                        color: colors.background,
                     },
                  ]}
               >
                  Created {new Date(space.created_at).toLocaleDateString()}
               </Text>
            </View>
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   header: {
      paddingHorizontal: 14,
      paddingBottom: 24,
   },
   spaceInfo: {
      flexDirection: "row",
      padding: 16,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
   },
   spaceIconLarge: {
      width: 100,
      height: 100,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
   },
   spaceEmojiLarge: {
      fontSize: 40,
   },
   spaceMeta: {
      flex: 1,
   },
   spaceTitle: {
      fontSize: FontSizes.xxl,
      fontFamily: Fonts.bold,
      marginBottom: 4,
   },
   spaceDescription: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
      marginBottom: 8,
      lineHeight: 20,
   },
   spaceDate: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
})
