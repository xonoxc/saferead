import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { FileText, Calendar, TriangleAlert as AlertTriangle, Shield } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

import type { Document } from "@/types"

interface DocumentCardProps {
  document: Document
  onPress: () => void
  onAnalyze?: () => void
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress, onAnalyze }) => {
  const { colors } = useTheme()

  const getRiskColor = (risk: string | undefined) => {
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

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FileText size={20} color={colors.primary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {document.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {document.type} • {formatFileSize(document.fileSize)}
          </Text>
        </View>
        {document.isEncrypted && <Shield size={16} color={colors.success} />}
      </View>

      <View style={styles.content}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={colors.textMuted} />
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {new Date(document.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {document.analysis && (
          <View style={styles.analysisContainer}>
            <View style={styles.riskIndicator}>
              <AlertTriangle
                size={14}
                color={getRiskColor(document.analysis.riskAssessment?.overallRisk)}
              />
              <Text
                style={[
                  styles.riskText,
                  { color: getRiskColor(document.analysis.riskAssessment?.overallRisk) },
                ]}
              >
                {document.analysis.riskAssessment?.overallRisk || "Unknown"} Risk
              </Text>
            </View>

            <Text style={[styles.summary, { color: colors.textSecondary }]} numberOfLines={2}>
              {document.analysis.summary}
            </Text>
          </View>
        )}

        {!document.analysis && onAnalyze && (
          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: colors.primary }]}
            onPress={e => {
              e.stopPropagation()
              onAnalyze()
            }}
          >
            <Text style={[styles.analyzeButtonText, { color: "#FFFFFF" }]}>Analyze Document</Text>
          </TouchableOpacity>
        )}
      </View>

      {document.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {document.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.surface }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
            </View>
          ))}
          {document.tags.length > 3 && (
            <Text style={[styles.moreTagsText, { color: colors.textMuted }]}>
              +{document.tags.length - 3} more
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  content: {
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    marginLeft: 4,
  },
  analysisContainer: {
    marginTop: 8,
  },
  riskIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  riskText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    marginLeft: 4,
    textTransform: "capitalize",
  },
  summary: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  analyzeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  analyzeButtonText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  moreTagsText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
})
