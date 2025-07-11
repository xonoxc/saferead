import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Link, type RelativePathString } from "expo-router"
import {
  Upload,
  FileText,
  TrendingUp,
  CircleAlert as AlertCircle,
  Clock,
  LucideIcon,
  ScanText,
} from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useDocumentStore } from "@/store/useDocumentStore"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Document } from "@/types"
import { useTabHideScroll } from "@/hooks/useTabHideScroll"

export default function HomeScreen() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { documents } = useDocumentStore()
  const [quickActions, stats] = getStatsAndActions({ colors, documents })
  const { handleScroll } = useTabHideScroll()

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      bounces
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.username}</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          stat={stats[0]}
          style={{
            width: "100%",
            height: 130,
            marginBottom: 12,
            flex: 1,
            marginRight: 12,
          }}
        />
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <StatCard stat={stats[1]} style={{ width: "100%", height: 130, marginBottom: 12 }} />
            <StatCard stat={stats[2]} style={{ width: "100%", height: 120 }} />
          </View>
          <StatCard stat={stats[3]} style={{ width: "48%", height: 264 }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsScrollContainer}
        >
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href as RelativePathString}
              asChild
              style={styles.actionLink}
            >
              <TouchableOpacity
                style={[styles.actionCardTab, { backgroundColor: colors.card }]}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: `${action.color}20`, padding: 10 }]}
                >
                  <action.icon size={20} color={action.color} />
                </View>
                <View>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        {documents.length > 0 ? (
          <View style={styles.activityContainer}>
            {documents.slice(0, 3).map((doc, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.activityItem, { backgroundColor: colors.card }]}
                activeOpacity={0.7}
              >
                <View style={[styles.activityIcon, { backgroundColor: colors.surface }]}>
                  <FileText size={20} color={colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>
                    {doc.title}
                  </Text>
                  <Text style={[styles.activityDate, { color: colors.textSecondary }]}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                {doc.analysis && (
                  <View style={[styles.analysisStatus, { backgroundColor: colors.success }]}>
                    <Text style={[styles.analysisStatusText, { color: colors.surface }]}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <FileText size={48} color={colors.textMuted} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Documents Yet</Text>
            <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
              Start by scanning or uploading your first legal document
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

/*
 * StatCardProps defines the properties for the StatCard component.
 * **/
interface StatCardProps {
  stat: Stat
  style?: object
}

/*
 *StatCard component displays a single statistic card with an icon, value, and title.
 * **/
const StatCard = ({ stat, style }: StatCardProps) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }, style]}>
      <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
        <stat.icon size={24} color={stat.color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
    </View>
  )
}

/**
 *
 * QuickAction and Stat types are used to define the structure of quick actions and statistics displayed on the home screen.
 * **/
type QuickAction = {
  icon: LucideIcon
  title: string
  description: string
  href: unknown
  color: string
}

type Stat = {
  icon: LucideIcon
  title: string
  value: number
  color: string
}

/*
 * getStatsAndActions function generates quick actions and statistics
 * based on
 * the provided colors and documents.
 * **/
function getStatsAndActions({
  colors,
  documents,
}: {
  colors: any
  documents: Document[]
}): [QuickAction[], Stat[]] {
  const quickActions = [
    {
      icon: ScanText,
      title: "Scan Document",
      description: "Use camera to scan legal documents",
      href: "(application)/(tabs)/documents?action=scan",
      color: colors.primary,
    },
    {
      icon: Upload,
      title: "Upload File",
      description: "Import PDF or image files",
      href: "(application)/(tabs)/documents?action=upload",
      color: colors.secondary,
    },
    {
      icon: FileText,
      title: "Text Analysis",
      description: "Analyze text-based documents",
      href: "(application)/(tabs)/documents?action=text",
      color: colors.accent,
    },
  ]

  const stats = [
    {
      icon: FileText,
      title: "Documents",
      value: documents.length,
      color: colors.primary,
    },
    {
      icon: TrendingUp,
      title: "Analyzed",
      value: documents.filter(d => d.analysis).length,
      color: colors.success,
    },
    {
      icon: AlertCircle,
      title: "High Risk",
      value: documents.filter(d => d.analysis?.riskAssessment?.overallRisk === "high").length,
      color: colors.error,
    },
    {
      icon: Clock,
      title: "Pending",
      value: documents.filter(d => !d.analysis).length,
      color: colors.warning,
    },
  ]

  return [quickActions, stats]
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
  },
  actionsScrollContainer: {
    flexDirection: "row",
    gap: 15,
    paddingRight: 20,
    alignItems: "center",
  },
  actionCardTab: {
    flexDirection: "row",
    borderWidth: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 600,
    elevation: 2,
    gap: 12,
  },
  actionLink: {
    flex: 1,
    borderWidth: 2,
    borderColor: "gray",
    borderStyle: "dashed",
    borderRadius: 18,
    width: 200,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.semiBold,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    marginLeft: 10,
    flex: 1,
  },
  activityContainer: {
    gap: 8,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  statCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  },
  activityTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  activityDate: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  analysisStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  analysisStatusText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginTop: 16,
  },
  emptyStateDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  leftColumn: {
    width: "48%",
  },
})
