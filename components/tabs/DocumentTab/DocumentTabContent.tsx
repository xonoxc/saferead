import React from "react"

import { View, StyleSheet, FlatList, RefreshControl } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import { useDocumentScreen } from "@/hooks/screens/useDocumentScreen"

import { LoadingSpinner } from "@/components/LoadingSpinner"
import { UniversalFilter } from "@/components/filters/UniversalFilters"
import { documentFilterFields } from "@/constants/filters"

import { DocumentTabCard } from "@/components/tabs/DocumentTab/DocumentTabCard"
import { DocumentsEmptyState } from "@/components/tabs/DocumentTab/DocuementEmptyState"

import DocumentTabSearch from "@/components/tabs/DocumentTab/DocumentTabSearch"
import DocumentTabErrorMessage from "@/components/tabs/DocumentTab/DocumentTabErrorMessage"
import DocumentTabLoadingState from "@/components/tabs/DocumentTab/DocumentTabLoadingState"

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

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <DocumentTabErrorMessage error={error} />

         <DocumentTabSearch
            searchQuery={searchQuery}
            setShowFilter={setShowFilter}
            handleSearch={handleSearch}
         />

         {(() => {
            switch (true) {
               case isDocumentsDataAvailable():
                  return (
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
                        keyboardShouldPersistTaps="always"
                     />
                  )

               case isLoading && currentFilters.search === searchQuery:
                  return <DocumentTabLoadingState message="loading..." />

               case isRefreshing:
                  return <DocumentTabLoadingState message="refreshing documents..." />

               default:
                  return (
                     <DocumentsEmptyState
                        searchControl={{
                           value: searchQuery,
                           onChange: setSearchQuery,
                        }}
                     />
                  )
            }
         })()}

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
