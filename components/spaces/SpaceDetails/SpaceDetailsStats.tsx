import { View, Text, StyleSheet } from "react-native"
import { Fonts, FontSizes } from "@/constants"
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated"

import type { LucideIcon } from "lucide-react-native"
import type { ColorsType } from "@/hooks/useTheme"

interface SpaceDetailsStatsProps {
  stats: {
    icon: LucideIcon
    label: string
    value: number | undefined
    color: string | undefined
  }[]
  colors: ColorsType
}

export default function SpaceDetailsStats({ stats, colors }: SpaceDetailsStatsProps) {
  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <Animated.View
          key={index}
          entering={FadeInRight.delay(300 + index * 100).springify()}
          style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.statIcon, { backgroundColor: stat.color + "15" }]}>
            <stat.icon size={20} color={stat.color} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
        </Animated.View>
      ))}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
})
