import React from "react"
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
import Animated, { FadeInDown } from "react-native-reanimated"
import { Search, Filter, FileText, Trash2, TrendingUp } from "lucide-react-native"
import { ColorsType, useTheme } from "@/hooks/useTheme"
import { DocumentFilter } from "../documents/DocumentFilter"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Fonts, FontSizes } from "@/constants"
import { AnalysisResponse } from "@/types/api/documents.types"
import { DocumentCardSkeleton } from "@/components/skeletons"
import { useTabBarVisibility } from "@/hooks/useTabBarVisiblitiy"

const SKELETON_COUNT = 3

import type { FilterOptions as DocumentFilters } from "@/types/docs"
import { EmptyState } from "../EmptyState"

export interface SideBarDocumentContentProps {
  spaceId?: string
  spaceName?: string
  isLoading: boolean
  isRefreshing: boolean
  isDeleting: boolean

  documents: AnalysisResponse[]
  error: any

  hasMore: boolean
  currentFilters: DocumentFilters
  searchQuery: string
  showFilter: boolean

  applyFilters: (filters: DocumentFilters) => void
  setShowFilter: (visible: boolean) => void
  setSearchQuery: (query: string) => void

  handleAddDocument: () => void
  handleDeleteDocument: (id: string) => void
  handleDocumentSelectPress: (doc: AnalysisResponse) => void
  handleSearch: (query: string) => void
  handleRefresh: () => void
  loadMoreDocuments: () => void

  FallbackStateWrapper: React.ComponentType
}

export default function SideBarDocumentContent({
  documents,
  error,
  hasMore,
  currentFilters,
  searchQuery,
  setSearchQuery,
  applyFilters,
  showFilter,
  isLoading,
  isRefreshing,
  setShowFilter,
  handleDeleteDocument,
  handleDocumentSelectPress,
  handleSearch,
  handleAddDocument,
  handleRefresh,
  loadMoreDocuments,
  isDeleting,
  FallbackStateWrapper,
}: SideBarDocumentContentProps) {
  const { colors } = useTheme()

  useTabBarVisibility(!isLoading)

  const renderDocument = ({ item, index }: { item: AnalysisResponse; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50 + 300).springify()}>
      <DocumentCard
        document={item}
        onPress={() => handleDocumentSelectPress(item)}
        onDelete={handleDeleteDocument}
      />
    </Animated.View>
  )

  const isDocumentsDataAvailable = () => {
    return documents.length > 0 && !error
  }

  const renderFooter = () => {
    if (!hasMore) return null
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner size="small" />
      </View>
    )
  }

  if (isLoading || isRefreshing || isDeleting) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}></View>
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchInputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Search size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={text => handleSearch(text)}
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
        <FlatList
          data={Array.from({ length: SKELETON_COUNT }).map((_, i) => ({ id: `skeleton-${i}` }))}
          keyExtractor={item => item.id}
          renderItem={() => <DocumentCardSkeleton />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchContainer}>
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
            onChangeText={text => handleSearch(text)}
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
      </Animated.View>

      {error?.message && (
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}
        >
          <Text style={[styles.errorText, { color: colors.error }]}>{error.message}</Text>
        </Animated.View>
      )}

      {isDocumentsDataAvailable() ? (
        <FlatList
          data={documents}
          renderItem={renderDocument}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              progressBackgroundColor={colors.background}
            />
          }
          onEndReached={loadMoreDocuments}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={FallbackStateWrapper}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={searchQuery ? Search : FileText}
          title={searchQuery ? "No Results Found" : "No Documents Yet"}
          description={
            searchQuery
              ? `No documents match "${searchQuery}". Try adjusting your search terms or check your spelling.`
              : "Start your legal document analysis journey by adding your first document. Upload files, scan documents, or paste text to get started."
          }
          actionTitle={searchQuery ? undefined : "Add Your First Document"}
          onAction={searchQuery ? undefined : handleAddDocument}
          secondaryActionTitle={searchQuery ? "Clear Search" : "Learn More"}
          onSecondaryAction={searchQuery ? () => setSearchQuery("") : () => {}}
          variant={searchQuery ? "search" : "default"}
          showFloatingElements={!searchQuery}
        />
      )}

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
  spaceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    borderWidth: 0,
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
    borderWidth: 0,
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
    paddingBottom: 120,
  },
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
})
