import { useTheme } from "@/hooks/useTheme"
import { router } from "expo-router"
import { ChevronLeft, ChevronRight } from "lucide-react-native"
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native"

export type BackBtnDirection = "left" | "right"

interface CustomBackBtnProps {
  onPress?: () => void
  style?: ViewStyle
  direction?: BackBtnDirection
}

export function CustomBackBtn({ onPress, style, direction = "left" }: CustomBackBtnProps) {
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
      {direction === "left" ? (
        <ChevronLeft size={24} color={colors.text} />
      ) : (
        <ChevronRight size={24} color={colors.text} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
})
