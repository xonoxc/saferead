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

import type { DocumentFilterOptions } from "@/types/docs"
import type { AnalysisResponse } from "@/types/api/documents.types"
import { DocumentsEmptyState } from "./DocuementEmptyState"
import type { SetStateFunction } from "@/types/state"

interface DocumentTabContentProps {
   spaceId?: string
   spaceName?: string
   isLoading: boolean
   isRefreshing: boolean
   isDeleting: boolean

   documents: AnalysisResponse[]
   error: any

   hasMore: boolean
   currentFilters: DocumentFilterOptions
   searchQuery: string
   showFilter: boolean

   applyFilters: (filters: DocumentFilterOptions) => void
   setShowFilter: (visible: boolean) => void
   setSearchQuery: SetStateFunction<string>

   handleDeleteDocument: (id: string) => void
   handleDocumentSelectPress: (doc: AnalysisResponse) => void
   handleSearch: (query: string) => void
   handleRefresh: () => void
   loadMoreDocuments: () => void

   FallbackStateWrapper: React.ComponentType
}

export default function DocumentTabContent({
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
   handleRefresh,
   loadMoreDocuments,
   isDeleting,
   FallbackStateWrapper,
}: DocumentTabContentProps) {
   const { colors } = useTheme()

   const renderDocument = ({ item, index }: { item: AnalysisResponse; index: number }) => (
      <Animated.View entering={FadeInDown.delay(index * 50 + 300).springify()}>
         <DocumentTabCard
            document={item}
            onPress={() => handleDocumentSelectPress(item)}
            onDelete={handleDeleteDocument}
         />
      </Animated.View>
   )

   const isDocumentsDataAvailable = () => documents.length > 0 && !error

   const keyExtractor = (item: AnalysisResponse) => item.id

   const renderFooter = () => {
      if (!hasMore) return null
      return (
         <View style={styles.footerLoader}>
            <LoadingSpinner />
         </View>
      )
   }

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
