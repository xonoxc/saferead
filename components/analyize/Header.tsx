import { Pressable, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import UpgradeButton from "@/components/UpgradeButton"
import { CircleEllipsis, LogOut } from "lucide-react-native"

import { router } from "expo-router"

import type { Space } from "@/types"
import type { ColorsType } from "@/hooks/useTheme"
import type { RoutePath } from "@/types/path"

interface AnalyzeHeaderProps {
   selectedSpace?: Space | null
   onSpaceExitButtonPress: () => void
   colors: ColorsType
}

export default function AnalyzeHeader({
   selectedSpace,
   onSpaceExitButtonPress,
   colors,
}: AnalyzeHeaderProps) {
   const handleHamBurgerPress = () => {
      router.push("/(application)/scan_menu_screen")
   }

   return (
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
         <View style={styles.innerHeader}>
            {/* Left: Menu */}
            <Pressable onPress={handleHamBurgerPress}>
               <CircleEllipsis color={colors.textMuted} size={27} />
            </Pressable>

            {/* Center: Upgrade */}
            <View style={{ flex: 1, alignItems: "center" }}>
               <UpgradeButton returnTo={"/analyize" as RoutePath} />
            </View>

            {/* Right: Exit only if inside Chat */}
            {selectedSpace ? (
               <Pressable onPress={onSpaceExitButtonPress}>
                  <LogOut size={22} color={colors.text} />
               </Pressable>
            ) : (
               <View style={{ width: 24 }} />
            )}
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   header: {
      padding: 20,
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingHorizontal: 10,
      paddingBottom: 0,
   },
   innerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 10,
   },
})
