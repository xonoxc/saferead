import React from "react"
import DocumentTabLoadingState from "./DocumentTabLoadingState"
import DocumentTabErrorMessage from "./DocumentTabErrorMessage"
import DocumentTabSearch from "./DocumentTabSearch"

import { View, StyleSheet, FlatList, RefreshControl } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { DocumentTabCard } from "./DocumentTabCard"
import { UniversalFilter } from "@/components/filters/UniversalFilters"
import { documentFilterFields } from "@/constants/filters"

import { DocumentsEmptyState } from "./DocuementEmptyState"
import { useDocumentScreen } from "@/hooks/screens/useDocumentScreen"

import type { AnalysisResponse } from "@/types/api/documents.types"

export default function DocumentTabContent() {
   const { colors } = useTheme()

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

   const isDocumentsDataAvailable = () => documents.length > 0 && !error

   const keyExtractor = (item: AnalysisResponse) => item.id

   if (isLoading || isDeleting || isRefreshing) return <DocumentTabLoadingState />

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <DocumentTabSearch
            searchQuery={searchQuery}
            setShowFilter={setShowFilter}
            handleSearch={handleSearch}
         />

         <DocumentTabErrorMessage error={error} />

         {isDocumentsDataAvailable() ? (
            <FlatList
               data={documents}
               bounces={true}
               renderItem={args =>
                  renderDocument({
                     ...args,
                     handleDocumentSelectPress,
                     handleDeleteDocument,
                  })
               }
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
               ListFooterComponent={() => renderFooter(hasMore)}
               ListEmptyComponent={FallbackStateWrapper}
               showsVerticalScrollIndicator={false}
            />
         ) : (
            <DocumentsEmptyState
               searchControl={{
                  value: searchQuery,
                  onChange: setSearchQuery,
               }}
            />
         )}

         <UniversalFilter
            fields={documentFilterFields}
            visible={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={applyFilters}
            currentFilters={currentFilters}
         />
      </View>
   )
}

const renderDocument = ({
   item,
   index,
   handleDocumentSelectPress,
   handleDeleteDocument,
}: {
   item: AnalysisResponse
   index: number
   handleDocumentSelectPress: (document: AnalysisResponse) => void
   handleDeleteDocument: (documentId: string) => void
}) => (
   <Animated.View entering={FadeInDown.delay(index * 50 + 300).springify()}>
      <DocumentTabCard
         document={item}
         onPress={() => handleDocumentSelectPress(item)}
         onDelete={handleDeleteDocument}
      />
   </Animated.View>
)

const renderFooter = (hasMore: boolean) => {
   if (!hasMore) return null
   return (
      <View style={styles.footerLoader}>
         <LoadingSpinner />
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
