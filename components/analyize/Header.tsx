import { Pressable, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { CircleEllipsis, LogOut } from "lucide-react-native"
import { router } from "expo-router"

import { useTheme } from "@/hooks/useTheme"
import { Spacing } from "@/constants/Design"

import type { Space } from "@/types"

interface AnalyzeHeaderProps {
   selectedSpace?: Space | null
   onSpaceExitButtonPress: () => void
}

/*
 * Chat section header: menu + exit, when in a space.
 *
 * The upgrade button used to live here, taking up the center. Removed.
 * The space selector and space name sit inline now, in the message area
 * itself, so the header stays clean while you're chatting.
 * **/
export default function AnalyzeHeader({ selectedSpace, onSpaceExitButtonPress }: AnalyzeHeaderProps) {
   const { colors } = useTheme()

   const handleHamBurgerPress = () => {
      router.push("/(application)/scan_menu_screen")
   }

   return (
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
         <View style={[styles.innerHeader, { borderBottomColor: colors.border }]}>
            {/* Left: Menu */}
            <Pressable onPress={handleHamBurgerPress} hitSlop={8}>
               <CircleEllipsis color={colors.textMuted} size={24} />
            </Pressable>

            {/* Right: Exit (only in chat) */}
            {selectedSpace ? (
               <Pressable onPress={onSpaceExitButtonPress} hitSlop={8}>
                  <LogOut size={22} color={colors.text} />
               </Pressable>
            ) : (
               <View style={{ width: 22 }} />
            )}
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   header: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      paddingBottom: Spacing.sm,
   },
   innerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: Spacing.sm,
      borderBottomWidth: 1,
   },
})
