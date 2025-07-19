import { useTheme } from "@/hooks/useTheme"
import { useRouter } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { TouchableOpacity, StyleSheet } from "react-native"

export default function CustomBackBtn({
  containerWidth,
  onBack,
  color,
}: {
  containerWidth?: number
  onBack?: () => void
  color?: string
}) {
  const { colors } = useTheme()
  const router = useRouter()

  const width = containerWidth ?? 50

  const handleBackPress = () => {
    if (onBack) {
      onBack()
      return
    }
    router.back()
  }

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: color ?? colors.border, width }]}
      onPress={handleBackPress}
    >
      <ChevronLeft color={color ?? colors.text} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 13,
    boxShadow: "none",
  },
})
