import { useTheme } from "@/hooks/useTheme"
import { router } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native"

export function CustomBackBtn({ onPress, style }: { onPress?: () => void; style?: ViewStyle }) {
  const { colors } = useTheme()
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
      style={[styles.button, { borderColor: colors.border }, style]}
    >
      <ChevronLeft size={24} color={colors.text} />
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
