import { View, Text, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { TrendingUp } from "lucide-react-native"

import { Fonts, FontSizes } from "@/constants"
import type { ColorsType } from "@/hooks/useTheme"
import type { StatsResponse } from "@/types/api/documents.types"

interface AnalyticsPanelProps {
   colors: ColorsType
   stats?: StatsResponse
}

export function AnalyticsPanel({ colors, stats }: AnalyticsPanelProps) {
   const avgConfidence = stats?.avg_confidence ? Math.round(stats.avg_confidence * 100) : 0

   return (
      <Animated.View
         entering={FadeInDown.delay(100).springify()}
         style={[
            styles.container,
            {
               backgroundColor: colors.surface,
               borderBottomLeftRadius: 20,
               borderBottomRightRadius: 20,
            },
         ]}
      >
         <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
         </View>

         <View
            style={[
               styles.confidenceCard,
               { backgroundColor: colors.card, borderColor: colors.border },
            ]}
         >
            <View style={styles.confidenceHeader}>
               <TrendingUp size={16} color={colors.primary} />
               <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                  Avg Confidence
               </Text>
            </View>
            <Text style={[styles.confidenceValue, { color: colors.text }]}>{avgConfidence}%</Text>
            <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
               <View
                  style={[
                     styles.progressFill,
                     {
                        width: `${avgConfidence}%`,
                        backgroundColor: colors.primary,
                     },
                  ]}
               />
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
      marginBottom: 12,
   },
   title: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
   },
   confidenceCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
   },
   confidenceHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
   },
   confidenceLabel: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
   confidenceValue: {
      fontSize: FontSizes.xxl,
      fontFamily: Fonts.bold,
      marginBottom: 12,
   },
   progressTrack: {
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
   },
   progressFill: {
      height: "100%",
      borderRadius: 3,
   },
})
