import { ColorsType, useTheme } from "@/hooks/useTheme"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ArrowDown, ArrowUp, FileText, Trash2, TrendingUp } from "lucide-react-native"

import type { AnalysisResponse } from "@/types/api/documents.types"
import { Fonts, FontSizes } from "@/constants"
import { useDrawerAlert } from "@/hooks/alerts/useAlert"

interface DocumentCardProps {
  document: AnalysisResponse
  onPress: () => void
  onDelete: (id: string) => void
}

export const SideBarDocumentCard = ({ document, onPress, onDelete }: DocumentCardProps) => {
  const { colors, isDark } = useTheme()

  const showBottomAlert = useDrawerAlert()

  const handleDelete = () => {
    /* "Delete Document",
      "Are you sure you want to delete this document? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(document.id),
        },
      ] */

    showBottomAlert({
      title: "Delete Document",
      message: "Are you sure you want to delete this document?",
      actions: [
        { text: "Cancel", style: "secondary", onPress: () => {} },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(document.id),
        },
      ],
    })
  }

  const isDocumentComplete = isDocumentStatusCompleted(document)

  return (
    <TouchableOpacity
      style={[
        styles.documentCard,
        {
          backgroundColor: isDark ? colors.card : colors.card,
          borderColor: colors.border,
          borderWidth: 1,
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
            <View style={styles.analysisStats}>
              <View style={styles.statTextView}>
                <ArrowUp color={colors.error} size={13} />
                <Text style={[styles.statText, { color: colors.error }]}>
                  {document.risky_points.length}
                </Text>
              </View>
              <View style={styles.statTextView}>
                <ArrowDown color={colors.success} size={13} />
                <Text style={[styles.statText, { color: colors.success }]}>
                  {document.favourable_points.length}
                </Text>
              </View>
            </View>

            <View style={styles.confidenceScoreView}>
              <TrendingUp size={13} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
                {(document.confidence_score * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
        )}
      </View>
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
    padding: 9,
    paddingVertical: 13,
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
    borderRadius: 4,
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
    borderRadius: 12,
    marginTop: 26,
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
    borderRadius: 8,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bold,
  },
  confidenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  confidenceText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  analysisPreview: {
    paddingTop: 8,
  },
  analysisStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statTextView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  statText: {
    fontSize: FontSizes.xs,
    flexDirection: "row",
    paddingHorizontal: 2,
    fontFamily: Fonts.medium,
  },
  confidenceScoreView: {
    flexDirection: "row",
    alignItems: "center",
  },
})
