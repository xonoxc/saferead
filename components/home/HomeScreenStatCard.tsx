import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { View, Text, StyleSheet } from "react-native"

import type { LucideIcon } from "lucide-react-native"

interface StatCardProps {
  stat: {
    icon: LucideIcon
    title: string
    value: number
    color: string
    isPercentage?: boolean
  }
  style?: object
}

export default function HomeScreenStatCard({ stat, style }: StatCardProps) {
  const { colors, isDark } = useTheme()
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: !isDark ? colors.border : "transparent" },
        style,
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: `${stat?.color}20` }]}>
        <stat.icon size={24} color={stat?.color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>
        {stat.value}
        {stat.isPercentage ? "%" : ""}
      </Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
})
