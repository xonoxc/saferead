import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from "react-native"
import {
  ArrowLeft,
  Share2,
  Download,
  TriangleAlert as AlertTriangle,
  Calendar,
  CircleCheck as CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react-native"
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { useVoice } from "@/hooks/useVoice"
import { Document, DocumentAnalysis } from "@/types"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { attempt } from "@/utils/attempt"

interface DocumentAnalysisViewProps {
  document: Document
  analysis: DocumentAnalysis
  onBack: () => void
}

export const DocumentAnalysisView: React.FC<DocumentAnalysisViewProps> = ({
  document,
  analysis,
  onBack,
}) => {
  const { colors } = useTheme()
  const { speakText } = useVoice()
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return colors.error
      case "medium":
        return colors.warning
      case "low":
        return colors.success
      default:
        return colors.textMuted
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return colors.error
      case "medium":
        return colors.warning
      case "low":
        return colors.success
      default:
        return colors.textMuted
    }
  }

  const handleShare = async () => {
    const resp = await attempt(
      Share.share({
        message: `Document Analysis: ${document.title}\n\nSummary: ${analysis.summary}`,
        title: "Document Analysis Report",
      })
    )
    if (!resp.ok) {
      console.error("Error sharing:", resp.error)
      return
    }
  }

  const handleSpeak = (text: string) => {
    speakText(text)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {document.title}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Risk Overview */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.riskOverview, { backgroundColor: colors.card }]}
        >
          <View style={styles.riskHeader}>
            <Text style={[styles.riskTitle, { color: colors.text }]}>Risk Assessment</Text>
            <View
              style={[
                styles.riskBadge,
                { backgroundColor: getRiskColor(analysis.riskAssessment.overallRisk) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.riskBadgeText,
                  { color: getRiskColor(analysis.riskAssessment.overallRisk) },
                ]}
              >
                {analysis.riskAssessment.overallRisk.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.riskStats}>
            <View style={styles.riskStat}>
              <Text style={[styles.riskStatNumber, { color: colors.error }]}>
                {analysis.riskyPoints || 0}
              </Text>
              <Text style={[styles.riskStatLabel, { color: colors.textSecondary }]}>
                Risky Points
              </Text>
            </View>
            <View style={styles.riskStat}>
              <Text style={[styles.riskStatNumber, { color: colors.success }]}>
                {analysis.favorablePoints || 0}
              </Text>
              <Text style={[styles.riskStatLabel, { color: colors.textSecondary }]}>
                Favorable Points
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Executive Summary */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Executive Summary</Text>
            <TouchableOpacity onPress={() => handleSpeak(analysis.summary)}>
              <Text style={[styles.speakButton, { color: colors.primary }]}>🔊 Listen</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {analysis.summary}
          </Text>
        </Animated.View>

        {/* Key Terms */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Terms & Definitions</Text>
          {analysis.keyTerms.map((term, index) => (
            <Animated.View
              key={index}
              entering={FadeInRight.delay(500 + index * 100).springify()}
              style={[styles.termItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.termHeader}>
                <Text style={[styles.termName, { color: colors.text }]}>{term.term}</Text>
                <View
                  style={[
                    styles.importanceBadge,
                    { backgroundColor: getImportanceColor(term.importance) + "20" },
                  ]}
                >
                  <Text
                    style={[styles.importanceText, { color: getImportanceColor(term.importance) }]}
                  >
                    {term.importance}
                  </Text>
                </View>
              </View>
              <Text style={[styles.termDefinition, { color: colors.textSecondary }]}>
                {term.definition}
              </Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Deadlines */}
        {analysis.deadlines.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            style={[styles.section, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Important Deadlines</Text>
            {analysis.deadlines.map((deadline, index) => (
              <View key={index} style={[styles.deadlineItem, { borderBottomColor: colors.border }]}>
                <View style={styles.deadlineIcon}>
                  <Calendar size={20} color={colors.warning} />
                </View>
                <View style={styles.deadlineContent}>
                  <Text style={[styles.deadlineDescription, { color: colors.text }]}>
                    {deadline.description}
                  </Text>
                  <Text style={[styles.deadlineDate, { color: colors.textSecondary }]}>
                    {new Date(deadline.date).toLocaleDateString()} • {deadline.daysRemaining} days
                    remaining
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Recommendations */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommendations</Text>
          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>
                {recommendation}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Sensitive Information */}
        {analysis.sensitiveInfo.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(800).springify()}
            style={[styles.section, { backgroundColor: colors.card }]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Sensitive Information
              </Text>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowSensitiveInfo(!showSensitiveInfo)}
              >
                {showSensitiveInfo ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {analysis.sensitiveInfo.map((info, index) => (
              <View
                key={index}
                style={[styles.sensitiveItem, { borderBottomColor: colors.border }]}
              >
                <View style={styles.sensitiveIcon}>
                  <AlertTriangle size={16} color={colors.warning} />
                </View>
                <View style={styles.sensitiveContent}>
                  <Text style={[styles.sensitiveType, { color: colors.text }]}>
                    {info.type.toUpperCase()}
                  </Text>
                  <Text style={[styles.sensitiveText, { color: colors.textSecondary }]}>
                    {showSensitiveInfo ? info.content : "••••••••"}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Document Sections */}
        <Animated.View
          entering={FadeInDown.delay(900).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Section Analysis</Text>
          {analysis.sections.map((section, index) => (
            <View
              key={index}
              style={[styles.documentSection, { borderBottomColor: colors.border }]}
            >
              <View style={styles.sectionTitleRow}>
                <Text style={[styles.documentSectionTitle, { color: colors.text }]}>
                  {section.title}
                </Text>
                <View
                  style={[
                    styles.importanceBadge,
                    { backgroundColor: getImportanceColor(section.importance) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.importanceText,
                      { color: getImportanceColor(section.importance) },
                    ]}
                  >
                    {section.importance}
                  </Text>
                </View>
              </View>
              <Text style={[styles.sectionAnalysis, { color: colors.textSecondary }]}>
                {section.analysis}
              </Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  riskOverview: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  riskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  riskTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  riskBadgeText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
  },
  riskStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  riskStat: {
    alignItems: "center",
  },
  riskStatNumber: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  riskStatLabel: {
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
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
  },
  summaryText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    lineHeight: 24,
  },
  termItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  termHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  termName: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    flex: 1,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  importanceText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    textTransform: "uppercase",
  },
  termDefinition: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  deadlineItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  deadlineIcon: {
    marginRight: 12,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  deadlineDate: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  toggleButton: {
    padding: 4,
  },
  sensitiveItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sensitiveIcon: {
    marginRight: 12,
  },
  sensitiveContent: {
    flex: 1,
  },
  sensitiveType: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  sensitiveText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  documentSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  documentSectionTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    flex: 1,
  },
  sectionAnalysis: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
})
