import { Fonts, FontSizes } from "@/constants"
import { RotateCcw, XCircle } from "lucide-react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"

import type { ColorsType } from "@/hooks/useTheme"

export default function HomeScreenErrorFallback({
   error,
   colors,
   onRetry,
}: {
   error: string
   colors: ColorsType
   onRetry: () => void
}) {
   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={styles.errorContainer}>
            <XCircle size={48} color={colors.error} />
            <Text style={[styles.errorTitle, { color: colors.text }]}>
               Unable to load statistics
            </Text>
            <Text style={[styles.errorDescription, { color: colors.textSecondary }]}>{error}</Text>

            <Pressable
               onPress={onRetry}
               style={[styles.retryButton, { backgroundColor: colors.primary }]}
            >
               <RotateCcw size={15} color={colors.background} strokeWidth={3} />
               <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
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
   retryButton: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      gap: 8,
      borderRadius: 8,
   },
   retryButtonText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
   },
})
