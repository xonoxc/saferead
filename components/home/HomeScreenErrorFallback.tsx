import { Fonts, FontSizes } from "@/constants"
import { ColorsType } from "@/hooks/useTheme"
import { XCircle } from "lucide-react-native"
import { StyleSheet, Text, View } from "react-native"

export default function HomeScreenErrorFallback({
  error,
  colors,
}: {
  error: string
  colors: ColorsType
}) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.errorContainer}>
        <XCircle size={48} color={colors.error} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>Unable to load statistics</Text>
        <Text style={[styles.errorDescription, { color: colors.textSecondary }]}>{error}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginTop: 16,
  },
  errorDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginTop: 8,
  },
})
