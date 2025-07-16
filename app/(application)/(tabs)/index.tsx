import React from "react"
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import {
  FileText,
  TrendingUp,
  CircleAlert as AlertCircle,
  Clock,
  LucideIcon,
  CheckCircle,
  XCircle,
  Shield,
  Scale,
  FileCheck,
  Loader,
} from "lucide-react-native"
import { ColorsType, useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useDocumentStats } from "@/hooks/useDocumentStats"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { useTabHideScroll } from "@/hooks/useTabHideScroll"

import { HomeScreenSkeleton } from "@/components/skeletons"
import type { StatsResponse } from "@/types/api/documents.types"

export default function HomeScreen() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { stats, isLoading, error, refetch } = useDocumentStats()
  const { handleScroll } = useTabHideScroll()
  const mainStats = getMainStats(stats as StatsResponse, colors)
  const typeStats = getTypeStats(stats, colors)

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.authPrompt}>
          <Text style={[styles.authTitle, { color: colors.text }]}>Welcome to SafeRead</Text>
          <Text style={[styles.authDescription, { color: colors.textSecondary }]}>
            Please log in to view your document statistics
          </Text>
        </View>
      </View>
    )
  }

  if (isLoading) {
    return <HomeScreenSkeleton />
  }

  if (error) {
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

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      bounces
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          colors={[colors.text]}
          progressBackgroundColor={colors.background}
        />
      }
    >
      {/* <View>
        <Logo />
      </View> */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.username}</Text>
      </Animated.View>

      {/* Main Statistics */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsGrid}>
        <StatCard
          stat={mainStats[0]}
          style={{
            width: "100%",
            height: 130,
            marginBottom: 12,
          }}
        />
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <StatCard
              stat={mainStats[1]}
              style={{ width: "100%", height: 130, marginBottom: 12 }}
            />
            <StatCard stat={mainStats[2]} style={{ width: "100%", height: 120 }} />
          </View>
          <StatCard stat={mainStats[3]} style={{ width: "48%", height: 264 }} />
        </View>
      </Animated.View>

      {/* Document Types */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Document Types</Text>
        <View style={styles.typeGrid}>
          {typeStats.map((stat, index) => (
            <View key={index} style={styles.typeRow}>
              <TypeCard stat={stat} />
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Processing Status */}
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

      {/* Pending Documents */}
      {stats && stats.pending > 0 && (
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Analysis</Text>
          <View style={[styles.processingCard, { backgroundColor: colors.card }]}>
            <View style={[styles.processingIcon, { backgroundColor: colors.warning + "20" }]}>
              <Clock size={24} color={colors.warning} />
            </View>
            <View style={styles.processingContent}>
              <Text style={[styles.processingValue, { color: colors.text }]}>{stats.pending}</Text>
              <Text style={[styles.processingLabel, { color: colors.textSecondary }]}>
                Documents waiting for analysis
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </ScrollView>
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

const StatCard = ({ stat, style }: StatCardProps) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }, style]}>
      <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
        <stat.icon size={24} color={stat.color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>
        {stat.value}
        {stat.isPercentage ? "%" : ""}
      </Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
    </View>
  )
}

const TypeCard = ({ stat }: StatCardProps) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.typeCard, { backgroundColor: colors.card }]}>
      <View style={[styles.typeIcon, { backgroundColor: `${stat.color}20` }]}>
        <stat.icon size={20} color={stat.color} />
      </View>
      <View style={styles.typeContent}>
        <Text style={[styles.typeTitle, { color: colors.text }]}>{stat.title}</Text>
        <Text style={[styles.typeValue, { color: stat.color }]}>{stat.value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  statsGrid: {
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  leftColumn: {
    width: "48%",
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    marginTop: 16,
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
  authPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  authDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
})
