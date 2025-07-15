import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native"
import { Plus, Search, Filter, FileText, Trash2, TrendingUp } from "lucide-react-native"
import { router } from "expo-router"
import { ColorsType, useTheme } from "@/hooks/useTheme"
import { useBackendDocuments } from "@/hooks/useBackendDocuments"
import { DocumentAnalysisView } from "@/components/documents/DocumentAnalysisView"
import { DocumentFilter } from "@/components/documents/DocumentFilter"
import { Button } from "@/components/Button"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { AnalysisResponse } from "@/services/api"

export default function DocumentsScreen() {
  const { colors } = useTheme()
  const {
    documents,
    error,
    hasMore,
    currentFilters,
    loadMoreDocuments,
    applyFilters,
    deleteDocument: deleteBackendDocument,
    refreshDocuments,
  } = useBackendDocuments()

  const [searchQuery, setSearchQuery] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<AnalysisResponse | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const handleAddDocument = () => {
    router.push("/(application)/(tabs)/analyize")
  }

  const handleDeleteDocument = async (documentId: string) => {
    const success = await deleteBackendDocument(documentId)
    if (success) {
      Alert.alert("Success", "Document deleted successfully")
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshDocuments()
    setRefreshing(false)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    const newFilters = {
      ...currentFilters,
      search: query || undefined,
    }
    await applyFilters(newFilters)
  }

  const handleDocumentPress = (document: AnalysisResponse) => {
    setSelectedDocument(document)
  }

  const renderDocument = ({ item }: { item: AnalysisResponse }) => (
    <DocumentCard
      document={item}
      onPress={() => handleDocumentPress(item)}
      onDelete={handleDeleteDocument}
    />
  )

  const renderFooter = () => {
    if (!hasMore) return null
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner size="small" />
      </View>
    )
  }

  if (selectedDocument) {
    return (
      <DocumentAnalysisView analysis={selectedDocument} onBack={() => setSelectedDocument(null)} />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Documents</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddDocument}
        >
          <Plus size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search documents..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setShowFilter(true)}
        >
          <Filter size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMoreDocuments}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={FallBackState}
        showsVerticalScrollIndicator={false}
      />

      <DocumentFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={applyFilters}
        currentFilters={currentFilters}
      />
    </View>
  )
}

interface DocumentCardProps {
  document: AnalysisResponse
  onPress: () => void
  onDelete: (id: string) => void
}

const DocumentCard = ({ document, onPress, onDelete }: DocumentCardProps) => {
  const { colors } = useTheme()

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
      style={[styles.documentCard, { backgroundColor: colors.card, borderColor: colors.border }]}
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

/*
 *
 *
 * fallback state component
 * **/
function FallBackState({
  searchQuery,
  handleAddDocument,
}: {
  searchQuery?: string
  handleAddDocument: () => void
}) {
  const { colors } = useTheme()

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
      <FileText size={64} color={colors.textMuted} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {searchQuery ? "No Documents Found" : "No Documents Yet"}
      </Text>
      <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
        {searchQuery
          ? "Try adjusting your search terms or filters"
          : "Start by analyzing your first legal document"}
      </Text>
      {!searchQuery && (
        <Button title="Add Document" onPress={handleAddDocument} variant="primary" size="large" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  errorContainer: {
    margin: 20,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  documentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.semiBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 40,
  },
})
