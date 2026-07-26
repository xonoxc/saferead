import { Pressable, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { CircleEllipsis, LogOut } from "lucide-react-native"
import { router } from "expo-router"

import { useTheme } from "@/hooks/useTheme"
import { Spacing } from "@/constants/Design"
import { SpaceIndicator } from "@/components/chat/spaceindicator/SpaceIndicator"

import type { Space } from "@/types"

interface AnalyzeHeaderProps {
   selectedSpace?: Space | null
   onSpaceExitButtonPress: () => void
}

/*
 * Chat header: menu, the current space, exit - one row.
 *
 * The upgrade button used to occupy the centre. In its place sits the space
 * pill, which previously lived in a full-width bar of its own directly below
 * this header: two stacked bars to say what one row can. Centring it also
 * makes the space you are talking to the subject of the screen, which is what
 * the centre slot is for.
 * **/
export default function AnalyzeHeader({
   selectedSpace,
   onSpaceExitButtonPress,
}: AnalyzeHeaderProps) {
   const { colors } = useTheme()

   const handleHamBurgerPress = () => {
      router.push("/(application)/scan_menu_screen")
   }

   return (
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
         <View style={[styles.innerHeader, { borderBottomColor: colors.border }]}>
            {/* Left: Menu */}
            <Pressable onPress={handleHamBurgerPress} hitSlop={8} style={styles.side}>
               <CircleEllipsis color={colors.textMuted} size={24} />
            </Pressable>

            {/* Centre: current space, tap to switch */}
            <View style={styles.centre}>{selectedSpace && <SpaceIndicator />}</View>

            {/* Right: Exit (only in chat) */}
            <View style={[styles.side, styles.sideRight]}>
               {selectedSpace && (
                  <Pressable onPress={onSpaceExitButtonPress} hitSlop={8}>
                     <LogOut size={22} color={colors.text} />
                  </Pressable>
               )}
            </View>
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   header: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
   },
   innerHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
   },
   /*
    * Equal fixed-width flanks rather than space-between, so the pill stays
    * optically centred no matter how long the space title is.
    * **/
   side: {
      width: 32,
      justifyContent: "center",
   },
   sideRight: {
      alignItems: "flex-end",
   },
   centre: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xs,
   },
})
