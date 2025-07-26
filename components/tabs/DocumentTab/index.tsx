
import React from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useDocumentScreen } from "@/hooks/screens/useDocumentScreen";

import DocumentTabHeader from "@/components/tabs/DocumentTab/DocumentTabHeader";
import DocumentTabContent from "@/components/tabs/DocumentTab/DocumentTabContent";

export default function DocumentTab() {
  const { colors } = useTheme();

  const {
    documents,
    error,
    spaceName,
    spaceColor,
    spaceId,
    isLoading,
    hasMore,
    currentFilters,
    searchQuery,
    showFilter,
    isRefreshing,
    setShowFilter,
    handleAddDocument,
    handleDocumentSelectPress,
    isDeleting,
    setSearchQuery,
    handleDeleteDocument,
    handleRefresh,
    handleSearch,
    loadMoreDocuments,
    applyFilters,
    FallbackStateWrapper,
  } = useDocumentScreen();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DocumentTabHeader
        spaceName={spaceName}
        spaceColor={spaceColor}
        handleAddDocument={handleAddDocument}
      />

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
          handleAddDocument={handleAddDocument}
          handleDeleteDocument={handleDeleteDocument}
          handleDocumentSelectPress={handleDocumentSelectPress}
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
          loadMoreDocuments={loadMoreDocuments}
          FallbackStateWrapper={FallbackStateWrapper}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10000,
  },
});
