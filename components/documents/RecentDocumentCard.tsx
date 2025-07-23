import { Fonts, FontSizes } from "@/constants/Fonts"
import { ColorsType, useTheme } from "@/hooks/useTheme"
import { AnalysisResponse } from "@/types/api/documents.types"
import { FileText, TrendingUp } from "lucide-react-native"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

interface RecentDocumentItemProps {
  document: AnalysisResponse
  onPress: () => void
  viewType?: "list" | "grid"
}

export const RecentDocumentItem = ({
  document,
  onPress,
  viewType = "list",
}: RecentDocumentItemProps) => {
  const { colors, isDark } = useTheme()
  const isGridView = viewType === "grid"
  const statusColor = getStatusColor(document.status, colors)

  return (
    <TouchableOpacity
      style={[
        styles.recentDocumentItem,
        isGridView ? styles.gridItem : styles.listItem,
        {
          backgroundColor: colors.card,
          borderWidth: isDark ? 0 : 1,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0 : 0.1,
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.documentHeader, isGridView && styles.gridDocumentHeader]}>
        <View
          style={[
            styles.documentIcon,
            {
              backgroundColor: isGridView ? statusColor + "20" : colors.primary + "20",
            },
          ]}
        >
          <FileText size={20} color={isGridView ? statusColor : colors.primary} />
        </View>
        <View style={styles.documentInfo}>
          <Text
            style={[
              styles.documentTitle,
              isGridView && styles.gridDocumentTitle,
              { color: colors.text },
            ]}
            numberOfLines={isGridView ? 2 : 1}
          >
            {document.original_filename}
          </Text>
          {!isGridView && (
            <Text style={[styles.documentType, { color: colors.textSecondary }]}>
              {getDocumentTypeLabel(document.document_type)}
            </Text>
          )}
        </View>
        {!isGridView && (
          <View style={styles.documentMeta}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{document.status}</Text>
            </View>
            <Text style={[styles.documentDate, { color: colors.textSecondary }]}>
              {new Date(document.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {isDocumentComplete(document) && !isGridView && (
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

const getStatusColor = (status: string, colors: ColorsType) => {
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
  gridDocumentHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  recentDocumentItem: {
    borderRadius: 21,
    padding: 16,
  },
  listItem: {
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
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
  gridDocumentTitle: {
    fontSize: FontSizes.sm,
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
