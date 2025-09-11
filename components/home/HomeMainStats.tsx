import Animated, { FadeInDown } from "react-native-reanimated"
import HomeScreenStatCard from "@/components/home/HomeScreenStatCard"
import { View, StyleSheet } from "react-native"
import { FileText, TrendingUp, CircleAlert as AlertCircle, CheckCircle } from "lucide-react-native"

import { type ColorsType, useTheme } from "@/hooks/useTheme"

import type { StatsResponse } from "@/types/api/documents.types"

export function HomeScreenMainStats({ stats }: { stats: StatsResponse }) {
  const { colors } = useTheme()
  const mainStats = getMainStats(stats as StatsResponse, colors)

  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsGrid}>
      <HomeScreenStatCard
        stat={mainStats[0]}
        style={{
          width: "100%",
          height: 130,
          marginBottom: 12,
        }}
      />
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <HomeScreenStatCard
            stat={mainStats[1]}
            style={{ width: "100%", height: 130, marginBottom: 12 }}
          />
          <HomeScreenStatCard stat={mainStats[2]} style={{ width: "100%", height: 120 }} />
        </View>
        <HomeScreenStatCard stat={mainStats[3]} style={{ width: "48%", height: 264 }} />
      </View>
    </Animated.View>
  )
}

const getMainStats = (stats: StatsResponse | undefined, colors: ColorsType) => {
  if (!stats) return []

  return [
    {
      icon: FileText,
      title: "Total Documents",
      value: stats.total_documents,
      color: colors.primary,
    },
    {
      icon: CheckCircle,
      title: "Completed",
      value: stats.completed,
      color: colors.success,
    },
    {
      icon: AlertCircle,
      title: "Failed",
      value: stats.failed,
      color: colors.error,
    },
    {
      icon: TrendingUp,
      title: "Avg Confidence",
      value: Math.round(stats.avg_confidence * 100),
      color: colors.primary,
      isPercentage: true,
    },
  ]
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  leftColumn: {
    width: "48%",
  },
  statsGrid: {
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
})
