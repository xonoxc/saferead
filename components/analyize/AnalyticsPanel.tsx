import { View, Text, StyleSheet, Dimensions } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { Files, Clock, TrendingUp, CheckCircle2, AlertCircle, Loader2 } from "lucide-react-native"

import { Fonts, FontSizes } from "@/constants"
import type { ColorsType } from "@/hooks/useTheme"
import type { StatsResponse } from "@/types/api/documents.types"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

interface AnalyticsPanelProps {
   colors: ColorsType
   stats?: StatsResponse
}

export function AnalyticsPanel({ colors, stats }: AnalyticsPanelProps) {
   const panelHeight = Math.min(SCREEN_WIDTH * 0.45, 280)

   const metrics = [
      {
         label: "Total Docs",
         value: stats?.total_documents?.toString() ?? "0",
         icon: Files,
         color: colors.emerald,
      },
      {
         label: "Completed",
         value: stats?.completed?.toString() ?? "0",
         icon: CheckCircle2,
         color: colors.success,
      },
      {
         label: "Processing",
         value: stats?.processing?.toString() ?? "0",
         icon: Loader2,
         color: colors.warning,
      },
      {
         label: "Failed",
         value: stats?.failed?.toString() ?? "0",
         icon: AlertCircle,
         color: colors.error,
      },
   ]

   const avgConfidence = stats?.avg_confidence ? Math.round(stats.avg_confidence * 100) : 0

   const successRate =
      stats?.total_documents && stats.total_documents > 0
         ? Math.round((stats.completed / stats.total_documents) * 100)
         : 0

   const getMostCommonType = () => {
      if (!stats?.by_type) return "N/A"
      const types = stats.by_type
      const max = Math.max(types.terms, types.privacy, types.legal, types.other)
      if (max === 0) return "N/A"
      if (types.terms === max) return "Terms"
      if (types.privacy === max) return "Privacy"
      if (types.legal === max) return "Legal"
      return "Other"
   }

   return (
      <Animated.View
         entering={FadeInDown.delay(100).springify()}
         style={[
            styles.container,
            {
               height: panelHeight,
               backgroundColor: colors.surface,
               borderBottomLeftRadius: 24,
               borderBottomRightRadius: 24,
            },
         ]}
      >
         <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
               Document processing overview
            </Text>
         </View>

         <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
               <View
                  key={metric.label}
                  style={[
                     styles.metricCard,
                     {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                     },
                  ]}
               >
                  <View style={[styles.iconBadge, { backgroundColor: metric.color + "20" }]}>
                     <metric.icon size={14} color={metric.color} />
                  </View>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{metric.value}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                     {metric.label}
                  </Text>
               </View>
            ))}
         </View>

         <View style={styles.bottomRow}>
            <View
               style={[
                  styles.confidenceCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
               ]}
            >
               <View style={styles.confidenceHeader}>
                  <TrendingUp size={14} color={colors.emerald} />
                  <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                     Avg Confidence
                  </Text>
               </View>
               <Text style={[styles.confidenceValue, { color: colors.emerald }]}>
                  {avgConfidence}%
               </Text>
               <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
                  <View
                     style={[
                        styles.progressFill,
                        {
                           width: `${avgConfidence}%`,
                           backgroundColor: colors.emerald,
                        },
                     ]}
                  />
               </View>
            </View>

            <View
               style={[
                  styles.infoCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
               ]}
            >
               <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Success Rate</Text>
               <Text style={[styles.infoValue, { color: colors.text }]}>{successRate}%</Text>
               <Text style={[styles.infoSub, { color: colors.textMuted }]}>
                  {getMostCommonType()}
               </Text>
            </View>
         </View>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   container: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
   },
   header: {
      marginBottom: 16,
   },
   title: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.semiBold,
   },
   subtitle: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
      marginTop: 2,
   },
   metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
   },
   metricCard: {
      flex: 1,
      minWidth: "45%",
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
   },
   iconBadge: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
   },
   metricValue: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
   },
   metricLabel: {
      fontSize: FontSizes.xxs,
      fontFamily: Fonts.regular,
      marginTop: 2,
   },
   bottomRow: {
      flexDirection: "row",
      gap: 8,
   },
   confidenceCard: {
      flex: 1.2,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
   },
   confidenceHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
   },
   confidenceLabel: {
      fontSize: FontSizes.xxs,
      fontFamily: Fonts.regular,
   },
   confidenceValue: {
      fontSize: FontSizes.xxl,
      fontFamily: Fonts.bold,
   },
   progressTrack: {
      height: 4,
      borderRadius: 2,
      marginTop: 8,
      overflow: "hidden",
   },
   progressFill: {
      height: "100%",
      borderRadius: 2,
   },
   infoCard: {
      flex: 0.8,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      justifyContent: "center",
   },
   infoLabel: {
      fontSize: FontSizes.xxs,
      fontFamily: Fonts.regular,
   },
   infoValue: {
      fontSize: FontSizes.xxl,
      fontFamily: Fonts.bold,
      marginTop: 2,
   },
   infoSub: {
      fontSize: FontSizes.xxs,
      fontFamily: Fonts.regular,
      marginTop: 4,
   },
})
