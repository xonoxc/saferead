import React from "react"
import { View, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/useTheme"
import { useDocumentScreen } from "@/hooks/screens/useDocumentScreen"

import DocumentTabContent from "@/components/tabs/DocumentTab/DocumentTabContent"

export default function DocumentTab() {
  const { colors } = useTheme()

  const {
    documents,
    error,
    spaceName,
    spaceId,
    isLoading,
    hasMore,
    currentFilters,
    searchQuery,
    showFilter,
    isRefreshing,
    setShowFilter,
    handleDocumentSelectPress,
    isDeleting,
    setSearchQuery,
    handleDeleteDocument,
    handleRefresh,
    handleSearch,
    loadMoreDocuments,
    applyFilters,
    FallbackStateWrapper,
  } = useDocumentScreen()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flex: 1 }}>
        <DocumentTabContent
          spaceId={spaceId}
          spaceName={spaceName}
          documents={documents}
          error={error}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          isDeleting={isDeleting}
          hasMore={hasMore}
          currentFilters={currentFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilter={showFilter}
          applyFilters={applyFilters}
          setShowFilter={setShowFilter}
          handleDeleteDocument={handleDeleteDocument}
          handleDocumentSelectPress={handleDocumentSelectPress}
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
          loadMoreDocuments={loadMoreDocuments}
          FallbackStateWrapper={FallbackStateWrapper}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10000,
  },
})
