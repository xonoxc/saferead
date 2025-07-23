import React from "react"
import { View, StyleSheet, FlatList, RefreshControl } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { Search, FileText } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { DocumentFilter } from "../documents/DocumentFilter"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { AnalysisResponse } from "@/types/api/documents.types"

import { EmptyState } from "../EmptyState"

import type { FilterOptions as DocumentFilters } from "@/types/docs"
import SideBarLoadingState from "./SideBarLoadingState"
import { SideBarDocumentCard } from "./SideBarDocumentCard"
import SidebarSearch from "./SideBarSearch"
import SideBarErrorMessage from "./SideBarErrorMessage"

interface SideBarDocumentContentProps {
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

  const renderDocument = ({ item, index }: { item: AnalysisResponse; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50 + 300).springify()}>
      <SideBarDocumentCard
        document={item}
        onPress={() => handleDocumentSelectPress(item)}
        onDelete={handleDeleteDocument}
      />
    </Animated.View>
  )

  const isDocumentsDataAvailable = () => {
    return documents.length > 0 && !error
  }

  const keyExtractor = (item: AnalysisResponse) => item.id

  const renderFooter = () => {
    if (!hasMore) return null
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner size="small" />
      </View>
    )
  }

  if (isLoading || isDeleting) {
    return (
      <SideBarLoadingState
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        setShowFilter={setShowFilter}
      />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SidebarSearch
        searchQuery={searchQuery}
        setShowFilter={setShowFilter}
        handleSearch={handleSearch}
      />

      <SideBarErrorMessage error={error} />

      {isDocumentsDataAvailable() ? (
        <FlatList
          data={documents}
          bounces={true}
          renderItem={renderDocument}
          keyExtractor={keyExtractor}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
})
