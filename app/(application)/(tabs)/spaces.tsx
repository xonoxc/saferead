import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpaceList } from "@/components/spaces/SpaceList"
import { SpaceForm } from "@/components/spaces/SpaceForm"
import useSpaceScreen from "@/hooks/screens/useSpacesScreen"
import SpacesFallback from "@/components/spaces/MainScreen/SpaceFallback"
import SpaceScreenHeader from "@/components/spaces/MainScreen/RenderHeaderFunc"

export default function SpacesScreen() {
  const { colors } = useTheme()

  const {
    spaces,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    createModalVisible,
    setCreateModalVisible,
    handleCreateSpace,
    handleDeleteSpace,
    handleSpaceSelectPress,
  } = useSpaceScreen()

  if (isLoading) return <LoadingSpinner />

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SpaceScreenHeader
        colors={colors}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCreateModalVisible={setCreateModalVisible}
      />

      <FlatList
        data={spaces}
        key={viewMode}
        numColumns={viewMode === "grid" ? 2 : 1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        renderItem={({ item }) => (
          <SpaceList
            space={item}
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
        <View style={[StyleSheet.absoluteFillObject, styles.modalOverlay]}>
          <SpaceForm onCreate={handleCreateSpace} onCancel={() => setCreateModalVisible(false)} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 100,
  },
})
