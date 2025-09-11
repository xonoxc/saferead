import { useTheme } from "@/hooks/useTheme"
import { router } from "expo-router"
import { ChevronLeft, ChevronRight } from "lucide-react-native"

import { TouchableOpacity, StyleSheet, type ViewStyle } from "react-native"

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

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      if (router.canGoBack()) router.back()
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, { borderColor: isDark ? colors.border : colors.secondary }, style]}
    >
      {isLeft(direction) ? (
        <ChevronLeft size={iconSize ?? 24} color={colors.text} />
      ) : (
        <ChevronRight size={24} color={colors.text} />
      )}
    </TouchableOpacity>
  )
}

function isLeft(direction: BackBtnDirection): boolean {
  return direction === "left"
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
})
