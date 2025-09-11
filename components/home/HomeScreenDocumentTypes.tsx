import TypeCard from "./HomeScreenTypeCard"

import Animated, { FadeInDown } from "react-native-reanimated"
import { View, Text, StyleSheet } from "react-native"
import { FileText, Shield, Scale, FileCheck } from "lucide-react-native"
import { Fonts, FontSizes } from "@/constants"

import { useTheme, type ColorsType } from "@/hooks/useTheme"

import type { StatsResponse } from "@/types/api/documents.types"

export default function HomeScreenDocumentType({ stats }: { stats: StatsResponse | undefined }) {
  const { colors } = useTheme()
  const typeStats = getTypeStats(stats, colors)

  return (
    <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Document Types</Text>
      <View style={styles.typeGrid}>
        {typeStats.map((stat, index) => (
          <View key={index} style={styles.typeRow}>
            <TypeCard stat={stat} colors={colors} />
          </View>
        ))}
      </View>
    </Animated.View>
  )
}

function getTypeStats(stats: StatsResponse | undefined, colors: ColorsType) {
  if (!stats) return []

  return [
    {
      icon: Scale,
      title: "Legal Agreements",
      value: stats.by_type.legal,
      color: colors.primary,
    },
    {
      icon: FileCheck,
      title: "Terms & Conditions",
      value: stats.by_type.terms,
      color: colors.secondary,
    },
    {
      icon: Shield,
      title: "Privacy Policies",
      value: stats.by_type.privacy,
      color: colors.accent,
    },
    {
      icon: FileText,
      title: "Other Documents",
      value: stats.by_type.other,
      color: colors.textSecondary,
    },
  ]
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
  typeGrid: {
    gap: 12,
  },
  typeRow: {
    width: "100%",
  },
})
