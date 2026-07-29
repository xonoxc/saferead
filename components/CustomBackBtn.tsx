import { useTheme } from "@/hooks/useTheme"
import type { RoutePath } from "@/types/path"
import { router, useLocalSearchParams } from "expo-router"
import { ChevronLeft, ChevronRight } from "lucide-react-native"

import { Pressable, StyleSheet, type ViewStyle } from "react-native"

export type BackBtnDirection = "left" | "right"

interface CustomBackBtnProps {
   onPress?: () => void
   style?: ViewStyle
   direction?: BackBtnDirection
   iconSize?: number
}

export function CustomBackBtn({
   onPress,
   style,
   iconSize,
   direction = "left",
}: CustomBackBtnProps) {
   const { colors, isDark } = useTheme()
   const { returnTo } = useLocalSearchParams<{
      returnTo?: RoutePath
   }>()

   const handlePress = () => {
      if (returnTo) {
         router.push(returnTo)
         return
      }
      if (onPress) {
         onPress()
         return
      }
      if (router.canGoBack()) router.back()
   }

   return (
      <Pressable
         onPress={handlePress}
         style={[styles.button, { borderColor: isDark ? colors.border : colors.secondary }, style]}
      >
         {isLeft(direction) ? (
            <ChevronLeft size={iconSize ?? 24} color={colors.text} />
         ) : (
            <ChevronRight size={24} color={colors.text} />
         )}
      </Pressable>
   )
}

function isLeft(direction: BackBtnDirection): boolean {
   return direction === "left"
}

const styles = StyleSheet.create({
   button: {
      /*
       * Sizes to the chevron, never to its parent.
       *
       * Without this the button stretches to full width in any flex column -
       * the default `alignItems: stretch` - which drew a bordered box across
       * the whole pricing header. Fixed here rather than in each caller
       * because a 24px icon in a full-bleed bordered box is never what anyone
       * wanted; nine call sites would otherwise each have to remember.
       * **/
      alignSelf: "flex-start",
      padding: 8,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
   },
})
