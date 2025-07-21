import { ColorsType, useTheme } from "@/hooks/useTheme"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { FileText, Trash2, TrendingUp } from "lucide-react-native"

import type { AnalysisResponse } from "@/types/api/documents.types"
import { Fonts, FontSizes } from "@/constants"

interface DocumentCardProps {
  document: AnalysisResponse
  onPress: () => void
  onDelete: (id: string) => void
}

export const SideBarDocumentCard = ({ document, onPress, onDelete }: DocumentCardProps) => {
  const { colors, isDark } = useTheme()

  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(document.id),
        },
      ]
    )
  }

  const isDocumentComplete = isDocumentStatusCompleted(document)

  return (
    <TouchableOpacity
      style={[
        styles.documentCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: isDark ? 0 : 1,
          shadowOpacity: isDark ? 0 : 0.1,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.documentIcon, { backgroundColor: colors.primary + "20" }]}>
          <FileText size={24} color={colors.primary} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={[styles.documentTitle, { color: colors.text }]} numberOfLines={1}>
            {document.original_filename}
          </Text>
          <Text style={[styles.documentType, { color: colors.textSecondary }]}>
            {getDocumentTypeLabel(document.document_type)}
          </Text>
          <Text style={[styles.documentDate, { color: colors.textSecondary }]}>
            {new Date(document.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error + "20" }]}
            onPress={e => {
              e.stopPropagation()
              handleDelete()
            }}
          >
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(document.status, colors) + "20" },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(document.status, colors) }]}>
            {document.status.toUpperCase()}
          </Text>
        </View>
        {isDocumentComplete && (
          <View style={styles.confidenceContainer}>
            <TrendingUp size={12} color={colors.primary} />
            <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
              {(document.confidence_score * 100).toFixed(0)}%
            </Text>
          </View>
        )}
      </View>

      {isDocumentComplete && (
        <View style={styles.analysisPreview}>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]} numberOfLines={2}>
            {document.summary_text}
          </Text>
          <View style={styles.analysisStats}>
            <Text style={[styles.statText, { color: colors.error }]}>
              {document.risky_points.length} risks
            </Text>
            <Text style={[styles.statText, { color: colors.success }]}>
              {document.favourable_points.length} favorable
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}

function getStatusColor(status: string, colors: ColorsType) {
  switch (status) {
    case "completed":
      return colors.success
    case "processing":
      return colors.warning
    case "failed":
      return colors.error
    default:
      return colors.textSecondary
  }
}

function getDocumentTypeLabel(type: string) {
  const types: Record<string, string> = {
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    legal: "Legal Agreement",
    other: "Other Document",
  }
  return types[type] || type
}

/*
 * isDocumentStatusCompleted
 * **/
function isDocumentStatusCompleted(document: AnalysisResponse): boolean {
  return document.status === "completed"
}

const styles = StyleSheet.create({
  documentCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
  },
  documentType: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    marginBottom: 2,
  },
  documentDate: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bold,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  confidenceText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  analysisPreview: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  summaryText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    marginBottom: 8,
  },
  analysisStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
})
