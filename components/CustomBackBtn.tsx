import { useTheme } from "@/hooks/useTheme"
import { useRouter } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { TouchableOpacity, StyleSheet } from "react-native"

export default function CustomBackBtn({ containerWidth }: { containerWidth?: number }) {
  const { colors } = useTheme()
  const router = useRouter()

  const width = containerWidth ?? 50

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: colors.border, width }]}
      onPress={() => router.back()}
    >
      <ChevronLeft color={colors.text} />
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
