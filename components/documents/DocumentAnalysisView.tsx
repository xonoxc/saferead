import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from "react-native"
import {
  Share2,
  Download,
  TriangleAlert as AlertTriangle,
  CheckCircle,
  TrendingUp,
  Volume2,
} from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { ColorsType, useTheme } from "@/hooks/useTheme"
import { useVoice } from "@/hooks/useVoice"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { AnalysisResponse } from "@/types/api/documents.types"
import { attempt } from "@/utils/attempt"
import { CustomBackBtn } from "../CustomBackBtn"
import { getDocumentShareContent } from "@/constants/share"

interface DocumentAnalysisViewProps {
  analysis: AnalysisResponse
  onBack: () => void
}

export const DocumentAnalysisView = ({ analysis, onBack }: DocumentAnalysisViewProps) => {
  const { colors, isDark } = useTheme()
  const { speakText } = useVoice()
  const [showAllRisks, setShowAllRisks] = useState(false)
  const [showAllFavorable, setShowAllFavorable] = useState(false)

  const handleShare = async () => {
    const shareContent = getDocumentShareContent(analysis)
    const result = await attempt(
      Share.share({
        message: shareContent,
        title: "Document Analysis Report",
      })
    )

    if (!result.ok) {
      console.error("Error sharing:", result.error)
    }
  }

  const handleSpeak = (text: string) => {
    speakText(text)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
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
        <View>
          <CustomBackBtn containerWidth={44} onBack={onBack} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {analysis.original_filename || "Document Analysis"}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status & Confidence */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: isDark ? 0 : 1,
              shadowOpacity: isDark ? 0 : 0.1,
            },
          ]}
        >
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getRiskColor(analysis, colors) + "20",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: colors.border,
                  shadowOpacity: isDark ? 0 : 0.1,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: getRiskColor(analysis, colors) }]}>
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
            <View
              style={[styles.riskBadge, { backgroundColor: getRiskColor(analysis, colors) + "20" }]}
            >
              <Text style={[styles.riskBadgeText, { color: getRiskColor(analysis, colors) }]}>
                {getOverallRisk(analysis)} RISK
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.error }]}>
                {analysis.risky_points.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Risks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {analysis.favourable_points.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorable</Text>
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: isDark ? 0 : 1,
              shadowOpacity: isDark ? 0 : 0.1,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Executive Summary</Text>
            <TouchableOpacity
              onPress={() => handleSpeak(analysis.summary_text)}
              style={styles.speakButton}
            >
              <Volume2 color={colors.accent} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
              {analysis.summary_text}
            </Text>
          </View>
        </Animated.View>

        {/* Risky Points */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: isDark ? 0 : 1,
              shadowOpacity: isDark ? 0 : 0.1,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Risky Points</Text>
            <View style={[styles.countBadge, { backgroundColor: colors.error + "20" }]}>
              <Text style={[styles.countText, { color: colors.error }]}>
                {analysis.risky_points.length}
              </Text>
            </View>
          </View>
          {analysis.risky_points
            .slice(0, showAllRisks ? analysis.risky_points.length : 3)
            .map((point, index) => (
              <View key={index} style={styles.pointItem}>
                <AlertTriangle size={16} color={colors.error} />
                <Text style={[styles.pointText, { color: colors.textSecondary }]}>{point}</Text>
              </View>
            ))}
          {analysis.risky_points.length > 3 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllRisks(!showAllRisks)}
            >
              <Text style={[styles.showMoreText, { color: colors.primary }]}>
                {showAllRisks ? "Show Less" : `Show ${analysis.risky_points.length - 3} More`}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Favorable Points */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: isDark ? 0 : 1,
              shadowOpacity: isDark ? 0 : 0.1,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorable Points</Text>
            <View style={[styles.countBadge, { backgroundColor: colors.success + "20" }]}>
              <Text style={[styles.countText, { color: colors.success }]}>
                {analysis.favourable_points.length}
              </Text>
            </View>
          </View>
          {analysis.favourable_points
            .slice(0, showAllFavorable ? analysis.favourable_points.length : 3)
            .map((point, index) => (
              <View key={index} style={styles.pointItem}>
                <CheckCircle size={16} color={colors.success} />
                <Text style={[styles.pointText, { color: colors.textSecondary }]}>{point}</Text>
              </View>
            ))}
          {analysis.favourable_points.length > 3 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllFavorable(!showAllFavorable)}
            >
              <Text style={[styles.showMoreText, { color: colors.primary }]}>
                {showAllFavorable
                  ? "Show Less"
                  : `Show ${analysis.favourable_points.length - 3} More`}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Document Info */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: isDark ? 0 : 1,
              shadowOpacity: isDark ? 0 : 0.1,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Document Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {analysis.document_type.toUpperCase()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Processed</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {new Date(analysis.processed_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Created</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {new Date(analysis.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{analysis.status}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

/*
 * Helper Functions
 * **/

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
  },
  speakButton: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    paddingVertical: 3,
    paddingHorizontal: 9,
    flexDirection: "row",
    gap: 4,
    borderRadius: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
