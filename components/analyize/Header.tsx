import { TouchableOpacity, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import UpgradeButton from "@/components/UpgradeButton"
import { CircleEllipsis, LogOut } from "lucide-react-native"

import { router } from "expo-router"

import type { Space } from "@/types"
import type { ColorsType } from "@/hooks/useTheme"

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
        <TouchableOpacity onPress={handleHamBurgerPress}>
          <CircleEllipsis color={colors.textMuted} size={27} />
        </TouchableOpacity>

        {/* Center: Upgrade */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <UpgradeButton />
        </View>

        {/* Right: Exit only if inside Chat */}
        {selectedSpace ? (
          <TouchableOpacity onPress={onSpaceExitButtonPress}>
            <LogOut size={22} color={colors.text} />
          </TouchableOpacity>
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
