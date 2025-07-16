import { Fonts, FontSizes } from "@/constants/Fonts"
import { useTheme } from "@/hooks/useTheme"
import { AnalysisResponse } from "@/services/api"
import { FileText, TrendingUp } from "lucide-react-native"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

interface RecentDocumentItemProps {
  document: AnalysisResponse
  onPress: () => void
}

export const RecentDocumentItem = ({ document, onPress }: RecentDocumentItemProps) => {
  const { colors } = useTheme()

  const getStatusColor = (status: string) => {
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

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      legal: "Legal Agreement",
      other: "Other Document",
    }
    return types[type] || type
  }

  return (
    <TouchableOpacity
      style={[styles.recentDocumentItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.documentHeader}>
        <View style={[styles.documentIcon, { backgroundColor: colors.primary + "20" }]}>
          <FileText size={20} color={colors.primary} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={[styles.documentTitle, { color: colors.text }]} numberOfLines={1}>
            {document.original_filename}
          </Text>
          <Text style={[styles.documentType, { color: colors.textSecondary }]}>
            {getDocumentTypeLabel(document.document_type)}
          </Text>
        </View>
        <View style={styles.documentMeta}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(document.status) + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(document.status) }]}>
              {document.status}
            </Text>
          </View>
          <Text style={[styles.documentDate, { color: colors.textSecondary }]}>
            {new Date(document.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {isDocumentComplete(document) && (
        <View style={styles.documentStats}>
          <View style={styles.statItem}>
            <TrendingUp size={14} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {(document.confidence_score * 100).toFixed(0)}% confidence
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {document.risky_points.length} risks • {document.favourable_points.length} favorable
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}

function isDocumentComplete(document: AnalysisResponse): boolean {
  return document.status === "completed"
}

const styles = StyleSheet.create({
  documentStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  statText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recentDocumentItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentType: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    marginBottom: 2,
  },
  documentMeta: {
    alignItems: "flex-end",
  },
  documentDate: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    textTransform: "capitalize",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
})
