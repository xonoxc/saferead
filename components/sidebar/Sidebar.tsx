import React from "react"
import { View, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"

import SideBarDocumentContent from "./SidebarContent"
import SideBarDocumentSpaceHeader from "./SiderBarDocumentSpaceHeader"
import { useTheme } from "@/hooks/useTheme"
import { useDocumentScreen } from "@/hooks/screens/useDocumentScreen"
import { useSidebarStore } from "@/store/sidebar/useSidebarStore"

export const SideBar = () => {
  const { colors } = useTheme()
  const { spaceId, spaceName, spaceColor } = useLocalSearchParams<{
    spaceId?: string
    spaceName?: string
    spaceColor?: string
  }>()

  const setIsOpen = useSidebarStore(s => s.setIsOpen)

  const {
    documents,
    error,
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
  } = useDocumentScreen(spaceId, spaceName)

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.background }]}>
      <SideBarDocumentSpaceHeader
        spaceName={spaceName}
        spaceColor={spaceColor}
        onClose={() => setIsOpen(false)}
        handleAddDocument={handleAddDocument}
      />

      <View style={{ flex: 1 }}>
        <SideBarDocumentContent
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
  )
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    paddingTop: 15,
  },
})
