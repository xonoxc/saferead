import { useTheme } from "@/hooks/useTheme"
import { useRouter } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { TouchableOpacity, StyleSheet } from "react-native"

export default function CustomBackBtn() {
  const { colors } = useTheme()
  const router = useRouter()

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: colors.border }]}
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
