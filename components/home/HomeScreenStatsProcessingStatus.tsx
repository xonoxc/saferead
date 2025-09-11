import Animated, { FadeInDown } from "react-native-reanimated"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Loader } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"

import type { StatsResponse } from "@/types/api/documents.types"

export default function HomeScreenStatsProcessingStatus({
  stats,
}: {
  stats: StatsResponse | undefined
}) {
  const { colors } = useTheme()

  return (
    <>
      {stats && stats.processing > 0 && (
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Currently Processing</Text>
          <View style={[styles.processingCard, { backgroundColor: colors.card }]}>
            <View style={[styles.processingIcon, { backgroundColor: colors.warning + "20" }]}>
              <Loader size={24} color={colors.warning} />
            </View>
            <View style={styles.processingContent}>
              <Text style={[styles.processingValue, { color: colors.text }]}>
                {stats.processing}
              </Text>
              <Text style={[styles.processingLabel, { color: colors.textSecondary }]}>
                Documents being analyzed
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
  },
  statCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
  },
  statTitle: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  confidenceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  confidenceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  confidenceContent: {
    flex: 1,
  },
  confidenceValue: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
  },
  confidenceLabel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  typeGrid: {
    gap: 12,
  },
  typeRow: {
    width: "100%",
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  typeContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  typeValue: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
  },
  processingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  processingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  processingContent: {
    flex: 1,
  },
  processingValue: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
  },
  processingLabel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
})
