import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from "react-native"
import {
  ArrowLeft,
  Share2,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { AnalysisResponse } from "@/services/api"

interface EnhancedAnalysisViewProps {
  analysis: AnalysisResponse
  onBack: () => void
}

export const EnhancedAnalysisView: React.FC<EnhancedAnalysisViewProps> = ({
  analysis,
  onBack,
}) => {
  const { colors } = useTheme()
  const [showAllRisks, setShowAllRisks] = useState(false)
  const [showAllFavorable, setShowAllFavorable] = useState(false)

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Document Analysis Report\n\nDocument: ${analysis.original_filename}\nType: ${analysis.document_type}\nConfidence Score: ${(analysis.confidence_score * 100).toFixed(1)}%\n\nSummary: ${analysis.summary_text}`,
        title: "Document Analysis Report",
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success
      case 'processing':
        return colors.warning
      case 'failed':
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'processing':
        return Clock
      case 'failed':
        return AlertTriangle
      default:
        return Clock
    }
  }

  const StatusIcon = getStatusIcon(analysis.status)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {analysis.original_filename}
        </Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Status Overview */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.statusCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.statusHeader}>
            <StatusIcon size={24} color={getStatusColor(analysis.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(analysis.status) }]}>
              {analysis.status.toUpperCase()}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <TrendingUp size={16} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {(analysis.confidence_score * 100).toFixed(1)}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Confidence</Text>
            </View>
            <View style={styles.statItem}>
              <AlertTriangle size={16} color={colors.error} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {analysis.risky_points.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Risky Points</Text>
            </View>
            <View style={styles.statItem}>
              <Shield size={16} color={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {analysis.favourable_points.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorable</Text>
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Executive Summary</Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {analysis.summary_text}
          </Text>
        </Animated.View>

        {/* Risky Points */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Risky Points</Text>
            <View style={[styles.countBadge, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.countText, { color: colors.error }]}>
                {analysis.risky_points.length}
              </Text>
            </View>
          </View>
          {analysis.risky_points
            .slice(0, showAllRisks ? analysis.risky_points.length : 3)
            .map((point, index) => (
              <View key={index} style={[styles.pointItem, { borderLeftColor: colors.error }]}>
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
                {showAllRisks ? 'Show Less' : `Show ${analysis.risky_points.length - 3} More`}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Favorable Points */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorable Points</Text>
            <View style={[styles.countBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.countText, { color: colors.success }]}>
                {analysis.favourable_points.length}
              </Text>
            </View>
          </View>
          {analysis.favourable_points
            .slice(0, showAllFavorable ? analysis.favourable_points.length : 3)
            .map((point, index) => (
              <View key={index} style={[styles.pointItem, { borderLeftColor: colors.success }]}>
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
                {showAllFavorable ? 'Show Less' : `Show ${analysis.favourable_points.length - 3} More`}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
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
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  statusText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
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
  summaryText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
    paddingBottom: 12,
  },
  pointText: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
  },
})