import { StyleSheet, View, TouchableOpacity } from "react-native"
import Animated from "react-native-reanimated"
import { LayoutGrid, List } from "lucide-react-native"
import { useSlidingSelector } from "@/hooks/animation/useSlidingSelector"

import { useTheme } from "@/hooks/useTheme"

interface ViewModeProps {
  viewMode: "list" | "grid"
  setViewMode: (mode: "list" | "grid") => void
}

export default function ViewMode({ viewMode, setViewMode }: ViewModeProps) {
  const { colors, isDark } = useTheme()

  const options = ["list", "grid"] as const
  const index = options.indexOf(viewMode)

  const bgAnim = useSlidingSelector(index, 50, 200, 15)

  return (
    <View style={[styles.container, { borderColor: isDark ? colors.border : colors.textMuted }]}>
      <Animated.View style={[styles.selector, { backgroundColor: colors.primary }, bgAnim]} />
      {options.map(option => {
        const isSelected = option === viewMode
        const color = isSelected ? colors.background : colors.textMuted
        const Icon = option === "list" ? List : LayoutGrid

        return (
          <TouchableOpacity
            key={option}
            onPress={() => setViewMode(option)}
            style={styles.iconWrapper}
            activeOpacity={0.8}
          >
            <Icon size={20} color={color} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    width: 98,
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  iconWrapper: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    zIndex: 1,
  },
  selector: {
    position: "absolute",
    width: "50%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 0,
  },
})
