import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable, Share, ActivityIndicator } from "react-native"
import {
   Share2,
   Download,
   TriangleAlert,
   CheckCircle,
   TrendingUp,
   Volume2,
} from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useVoice } from "@/hooks/useVoice"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { attempt } from "@/utils/attempt"
import { getDocumentShareContent } from "@/constants/share"
import { useTheme } from "@/hooks/useTheme"
import { CustomBackBtn } from "@/components/CustomBackBtn"
import { LineDivider } from "@/components/LineDivider"

import type { ColorsType } from "@/hooks/useTheme"
import type { AnalysisResponse } from "@/types/api/documents.types"

export const DocumentAnalysisView = ({
   analysis,
   onBack,
}: {
   analysis: AnalysisResponse
   onBack: () => void
}) => {
   const { colors } = useTheme()

   /*
    * Only a finished analysis gets the report layout.
    *
    * This screen used to render all six sections whatever the status, off a row
    * the worker had not touched yet: empty point arrays and a null score. The
    * result was not a blank page but a *fabricated* one - `getOverallRisk`
    * scores 0 risks against 0 favourable points as "MEDIUM RISK", beside "0%
    * Confidence", for a document nothing had read. Telling a user their
    * contract is medium-risk before it has been opened is worse than telling
    * them to wait.
    * **/
   const ready = analysis.status === "completed"

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <Header onBack={onBack} analysis={analysis} showActions={ready} />

         {ready ? (
            <ScrollView
               style={styles.content}
               contentContainerStyle={{ paddingBottom: 110 }}
               showsVerticalScrollIndicator={false}
            >
               <StatusCard analysis={analysis} />
               <SummarySection analysis={analysis} />
               <RiskyPointsSection points={analysis.risky_points} />
               <FavorablePointsSection points={analysis.favourable_points} />
               <DocumentInfoSection analysis={analysis} />
            </ScrollView>
         ) : (
            <UnfinishedState analysis={analysis} />
         )}
      </View>
   )
}

/*
 * Every status that is not `completed`. Deliberately one component rather than
 * three: pending, processing and failed differ only in the words and in whether
 * something is spinning.
 * **/
const UnfinishedState = ({ analysis }: { analysis: AnalysisResponse }) => {
   const { colors } = useTheme()
   const failed = analysis.status === "failed"

   return (
      <View style={styles.unfinishedState}>
         {failed ? (
            <TriangleAlert size={44} color={colors.error} />
         ) : (
            <ActivityIndicator size="large" color={colors.primary} />
         )}

         <Text style={[styles.unfinishedTitle, { color: colors.text }]}>
            {failed ? "Analysis failed" : "Reading your document"}
         </Text>

         <Text style={[styles.unfinishedBody, { color: colors.textSecondary }]}>
            {failed
               ? analysis.error_message ||
                 "Something went wrong while analysing this document. Try scanning it again."
               : "Scanned pages are read one at a time, so this can take a few minutes. You can leave this screen — the result will be waiting in your documents."}
         </Text>
      </View>
   )
}

const Header = ({
   onBack,
   analysis,
   showActions,
}: {
   onBack: () => void
   analysis: AnalysisResponse
   /*
    * Hidden until there is something to act on. Sharing a scan that is still
    * processing sends a report with an empty summary and no points.
    * **/
   showActions: boolean
}) => {
   const { colors, isDark } = useTheme()

   const handleShare = async () => {
      const result = await attempt(() =>
         Share.share({
            message: getDocumentShareContent(analysis),
            title: "Document Analysis Report",
         })
      )
      if (!result.ok) console.error("Share error:", result.error)
   }

   return (
      <Animated.View
         entering={FadeInDown.delay(100).springify()}
         style={[
            styles.header,
            {
               shadowColor: isDark ? "transparent" : colors.shadow,
               shadowOffset: { width: 0, height: 2 },
            },
         ]}
      >
         <CustomBackBtn onPress={onBack} />
         <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {analysis.original_filename || "Document Analysis"}
         </Text>
         {showActions && (
            <View style={styles.headerActions}>
               <Pressable style={styles.actionButton} onPress={handleShare}>
                  <Share2 size={20} color={colors.textSecondary} />
               </Pressable>
               <Pressable style={styles.actionButton}>
                  <Download size={20} color={colors.textSecondary} />
               </Pressable>
            </View>
         )}
      </Animated.View>
   )
}

const StatusCard = ({ analysis }: { analysis: AnalysisResponse }) => {
   const { colors, isDark } = useTheme()
   const riskColor = getRiskColor(analysis, colors)
   const statusColor = getStatusColor(analysis.status, colors)

   return (
      <Animated.View
         entering={FadeInDown.delay(200).springify()}
         style={[
            styles.statusCard,
            {
               borderColor: colors.border,
               borderWidth: isDark ? 0 : 1,
            },
         ]}
      >
         <View style={styles.statusHeader}>
            <View
               style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor + "20", borderColor: colors.border },
               ]}
            >
               <Text style={[styles.statusText, { color: statusColor }]}>
                  {analysis.status.toUpperCase()}
               </Text>
            </View>
            <View style={styles.confidenceContainer}>
               <TrendingUp size={16} color={colors.primary} />
               <Text style={[styles.confidenceText, { color: colors.text }]}>
                  {(analysis.confidence_score * 100).toFixed(0)}% Confidence
               </Text>
            </View>
         </View>
         <View style={styles.riskOverview}>
            <View style={[styles.riskBadge, { backgroundColor: riskColor + "20" }]}>
               <Text style={[styles.riskBadgeText, { color: riskColor }]}>
                  {getOverallRisk(analysis)} RISK
               </Text>
            </View>
         </View>
         <View style={styles.statsContainer}>
            <Stat label="Risks" value={analysis.risky_points.length} color={colors.error} />
            <Stat
               label="Favorable"
               value={analysis.favourable_points.length}
               color={colors.success}
            />
         </View>
      </Animated.View>
   )
}

const Stat = ({ label, value, color }: { label: string; value: number; color: string }) => (
   <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
   </View>
)

const SummarySection = ({ analysis }: { analysis: AnalysisResponse }) => {
   const { colors } = useTheme()
   const { speakText } = useVoice()

   return (
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
         <View style={styles.sectionHeader}>
            <LineDivider
               text="Executive Summary"
               textStyle={{
                  color: colors.text,
               }}
            />
            <View style={styles.speakBtnContainer}>
               <Pressable
                  onPress={() => speakText(analysis.summary_text)}
                  style={[styles.speakButton, { backgroundColor: colors.accent }]}
               >
                  <Volume2 size={20} color={colors.background} />
                  <Text
                     style={{
                        color: colors.background,
                        fontFamily: Fonts.medium,
                        fontSize: FontSizes.xs,
                     }}
                  >
                     Listen
                  </Text>
               </Pressable>
            </View>
         </View>
         <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {analysis.summary_text}
         </Text>
      </Animated.View>
   )
}

const RiskyPointsSection = ({ points }: { points: string[] }) => {
   const { colors } = useTheme()
   const [showAll, setShowAll] = useState(false)

   return (
      <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
         <SectionHeader title="Risky Points" count={points.length} color={colors.error} />
         {points.slice(0, showAll ? points.length : 3).map((p, i) => (
            <View key={i} style={styles.pointItem}>
               <TriangleAlert size={16} color={colors.error} />
               <Text style={[styles.pointText, { color: colors.textSecondary }]}>{p}</Text>
            </View>
         ))}
         {points.length > 3 && (
            <Pressable onPress={() => setShowAll(!showAll)} style={styles.showMoreButton}>
               <Text style={[styles.showMoreText, { color: colors.primary }]}>
                  {showAll ? "Show Less" : `Show ${points.length - 3} More`}
               </Text>
            </Pressable>
         )}
      </Animated.View>
   )
}

const FavorablePointsSection = ({ points }: { points: string[] }) => {
   const { colors } = useTheme()
   const [showAll, setShowAll] = useState(false)

   return (
      <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
         <SectionHeader title="Favorable Points" count={points.length} color={colors.success} />
         {points.slice(0, showAll ? points.length : 3).map((p, i) => (
            <View key={`${p}-${i}`} style={styles.pointItem}>
               <CheckCircle size={16} color={colors.success} />
               <Text style={[styles.pointText, { color: colors.textSecondary }]}>{p}</Text>
            </View>
         ))}
         {points.length > 3 && (
            <Pressable onPress={() => setShowAll(!showAll)} style={styles.showMoreButton}>
               <Text style={[styles.showMoreText, { color: colors.primary }]}>
                  {showAll ? "Show Less" : `Show ${points.length - 3} More`}
               </Text>
            </Pressable>
         )}
      </Animated.View>
   )
}

const SectionHeader = ({
   title,
   count,
   color,
}: {
   title: string
   count: number
   color: string
}) => (
   <View style={styles.sectionHeader}>
      <LineDivider text={title} textStyle={{ color }} />
      <View style={[styles.countBadge, { backgroundColor: color + "20" }]}>
         <Text style={[styles.countText, { color }]}>{count}</Text>
      </View>
   </View>
)

const DocumentInfoSection = ({ analysis }: { analysis: AnalysisResponse }) => {
   const { colors } = useTheme()
   return (
      <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
         <Text style={[styles.sectionTitle, { color: colors.text }]}>Document Information</Text>
         <View style={styles.infoGrid}>
            <Info label="Type" value={analysis.document_type.toUpperCase()} />
            <Info label="Processed" value={new Date(analysis.processed_at).toLocaleDateString()} />
            <Info label="Created" value={new Date(analysis.created_at).toLocaleDateString()} />
            <Info label="Status" value={analysis.status} />
         </View>
      </Animated.View>
   )
}

const Info = ({ label, value }: { label: string; value: string }) => {
   const { colors } = useTheme()
   return (
      <View style={styles.infoItem}>
         <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
         <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
   )
}

/*
 * Colour for the *pipeline status* - completed / processing / failed.
 *
 * Deliberately a separate scale from risk. Both badges used to be painted with
 * `getRiskColor`, so a finished analysis of a risky document rendered
 * "COMPLETED" in the same alarm red as "HIGH RISK" sitting directly beneath
 * it. Two different questions - did the scan work, and is the document
 * dangerous - must not share an answer colour.
 * **/
const getStatusColor = (status: string, colors: ColorsType) => {
   switch (status?.toLowerCase()) {
      case "completed":
         return colors.success
      case "failed":
         return colors.error
      case "pending":
      case "processing":
         return colors.info
      default:
         return colors.textSecondary
   }
}

/*
 * Get the color based on the overall risk level
 * ***/
const getRiskColor = (analysis: AnalysisResponse, colors: ColorsType) => {
   switch (getOverallRisk(analysis)) {
      case "HIGH":
         return colors.error
      case "LOW":
         return colors.success
      default:
         return colors.warning
   }
}

/*
 * Get the overall risk level based on the number of risky and favorable points
 * **/
const getOverallRisk = (analysis: AnalysisResponse) => {
   if (analysis.risky_points.length > analysis.favourable_points.length) {
      return "HIGH"
   } else if (analysis.risky_points.length < analysis.favourable_points.length) {
      return "LOW"
   } else {
      return "MEDIUM"
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      padding: 20,
      paddingTop: 10,
   },
   backButton: {
      padding: 8,
      marginRight: 12,
   },
   headerTitle: {
      flex: 1,
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
   },
   headerActions: {
      flexDirection: "row",
      gap: 12,
   },
   actionButton: {
      padding: 8,
   },
   content: {
      flex: 1,
      padding: 20,
   },
   unfinishedState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      paddingHorizontal: 40,
      paddingBottom: 80,
   },
   unfinishedTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
   },
   unfinishedBody: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      lineHeight: 20,
      textAlign: "center",
   },
   statusCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
   },
   statusHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
   },
   statusText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.bold,
   },
   confidenceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   confidenceText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
   riskOverview: {
      alignItems: "center",
      marginBottom: 16,
   },
   riskBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
   },
   riskBadgeText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.bold,
   },
   statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
   },
   statItem: {
      alignItems: "center",
   },
   statValue: {
      fontSize: FontSizes.xxxl,
      fontFamily: Fonts.bold,
      marginBottom: 4,
   },
   statLabel: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
   section: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
   },
   sectionHeader: {
      flexDirection: "column",
      gap: 9,
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   speakBtnContainer: {
      width: "100%",
      paddingTop: 8,
      justifyContent: "flex-end",
      alignItems: "flex-start",
   },
   sectionTitle: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.semiBold,
   },
   speakButton: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.medium,
      alignItems: "center",
      paddingVertical: 4,
      paddingHorizontal: 9,
      flexDirection: "row",
      gap: 4,
      borderRadius: 12,
   },
   countBadge: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 12,
   },
   countText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.bold,
   },
   summaryTextContainer: {
      width: "100%",
   },
   summaryText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.regular,
      lineHeight: 24,
      textAlign: "justify",
   },
   pointItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
      gap: 8,
   },
   pointText: {
      flex: 1,
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
      lineHeight: 20,
   },
   showMoreButton: {
      alignItems: "center",
      paddingVertical: 8,
   },
   showMoreText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
   infoGrid: {
      gap: 12,
   },
   infoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
   },
   infoLabel: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
   infoValue: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
   },
})
