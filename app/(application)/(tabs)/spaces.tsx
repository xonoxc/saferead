import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpaceList } from "@/components/spaces/SpaceList"
import { SpaceForm } from "@/components/spaces/SpaceForm"
import useSpaceScreen from "@/hooks/screens/useSpacesScreen"
import SpacesFallback from "@/components/spaces/MainScreen/SpaceFallback"
import SpaceScreenHeader from "@/components/spaces/MainScreen/RenderHeaderFunc"
import { UniversalFilter } from "@/components/filters/UniversalFilters"
import { spaceFilterFields } from "@/constants/filters"
import { Spacing } from "@/constants/Design"
import { SpacesScreenSkeleton } from "@/components/skeletons"

export default function SpacesScreen() {
   const { colors } = useTheme()

   const {
      spaces,
      isLoading,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
      viewMode,
      setCurrentFilters,
      showFilter,
      currentFilters,
      setShowFilter,
      setViewMode,
      searchQuery,
      setSearchQuery,
      createModalVisible,
      setCreateModalVisible,
      handleCreateSpace,
      handleDeleteSpace,
      handleSpaceSelectPress,
   } = useSpaceScreen()

   /*
    * A skeleton that mirrors the real layout reads as faster than a spinner,
    * because the shell is already in place when content lands.
    * **/
   if (isLoading) return <SpacesScreenSkeleton />

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <SpaceScreenHeader
            colors={colors}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setShowFilter={setShowFilter}
            setSearchQuery={setSearchQuery}
            setCreateModalVisible={setCreateModalVisible}
         />

         <FlatList
            data={spaces}
            key={viewMode}
            numColumns={viewMode === "grid" ? 2 : 1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={viewMode === "grid" ? styles.gridColumn : undefined}
            renderItem={({ item, index }) => (
               <SpaceList
                  space={item}
                  index={index}
                  viewMode={viewMode}
                  onDelete={handleDeleteSpace}
                  onSpaceSelect={handleSpaceSelectPress}
               />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={
               <SpacesFallback
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setShowCreateModal={() => setCreateModalVisible(true)}
               />
            }
            onEndReached={() => {
               if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage()
               }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
         />

         {createModalVisible && (
            <View
               style={[
                  StyleSheet.absoluteFillObject,
                  styles.modalOverlay,
                  { backgroundColor: colors.background },
               ]}
            >
               <SpaceForm
                  onCreate={handleCreateSpace}
                  onCancel={() => setCreateModalVisible(false)}
               />
            </View>
         )}

         <UniversalFilter
            fields={spaceFilterFields}
            visible={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={setCurrentFilters}
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
      paddingTop: Spacing.xs,
      paddingBottom: 110,
      flexGrow: 1,
   },
   /*
    * Cards carry their own left margin, so the row only needs to keep the
    * trailing gutter symmetrical.
    * **/
   gridColumn: {
      justifyContent: "flex-start",
      paddingRight: Spacing.md,
   },
   modalOverlay: {
      justifyContent: "center",
      alignItems: "center",
      padding: 14,
      zIndex: 100,
   },
})
