import { RelativePathString, router } from "expo-router"
import React, { useState } from "react"
import { View, StyleSheet, Alert, TouchableOpacity, FlatList, Text } from "react-native"
import { Box, Search, Plus, LayoutGrid, List } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useSpaces, useDeleteSpace } from "@/hooks/queries/spaces"
import { createSpace } from "@/services/api"
import { TextInput } from "@/components/TextInput"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpaceList } from "@/components/spaces/SpaceList"
import { CreateSpaceForm } from "@/components/spaces/CreateSpaceForm"
import { Space } from "@/types"
import { SpacePrivarcy } from "@/types/spaces"
import { EmptyState } from "@/components/EmptyState"
import { attempt } from "@/utils/attempt"
import { getErrorMessage } from "@/utils/helpers/respErrors"
import { useQueryClient } from "@tanstack/react-query"
import { SpaceIconName } from "@/constants/spaceform"
import { Fonts, FontSizes } from "@/constants"

import type { ViewType } from "@/types/view"

export default function SpacesScreen() {
  const { colors } = useTheme()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSpaces()
  const { mutate: deleteSpace } = useDeleteSpace()
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [viewMode, setViewMode] = useState<ViewType>("list")

  const queryClient = useQueryClient()

  const spaces = data?.pages.flatMap(page => page.results) ?? []

  const filteredSpaces = spaces.filter(
    space =>
      space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateSpace = async (
    title: string,
    description: string,
    color: string,
    icon: SpaceIconName,
    privacy: SpacePrivarcy,
    is_favorite: boolean
  ) => {
    const result = await attempt(
      createSpace({ title, description, color, icon, privacy, is_favorite })
    )
    if (!result.ok) {
      const errorMessage = getErrorMessage(result.error)
      Alert.alert("Error", errorMessage || "Failed to create space")
      return
    }

    await queryClient.invalidateQueries({
      queryKey: ["spaces"],
    })
    setCreateModalVisible(false)
  }

  const handleDeleteSpace = (spaceId: string, spaceName: string) => {
    Alert.alert("Delete Space", `Are you sure you want to delete "${spaceName}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteSpace(spaceId) },
    ])
  }

  const handleSpaceSelectPress = (space: Space) => {
    router.push(`/spaces/${space.id}` as RelativePathString)
  }

  if (isLoading) return <LoadingSpinner />

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={{ width: "auto" }}>
          <Text style={[styles.titleText, { color: colors.text }]}>Spaces</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setViewMode("list")} style={styles.iconButton}>
            <List size={24} color={viewMode === "list" ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode("grid")} style={styles.iconButton}>
            <LayoutGrid size={24} color={viewMode === "grid" ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            style={[styles.createButton, { backgroundColor: colors.primary }]}
          >
            <Plus size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { borderColor: colors.border }]}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search spaces..."
          />
        </View>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredSpaces}
        key={viewMode}
        numColumns={viewMode === "grid" ? 2 : 1}
        renderItem={({ item }) => (
          <SpaceList
            space={item}
            viewMode={viewMode}
            onDelete={handleDeleteSpace}
            onSpaceSelect={handleSpaceSelectPress}
          />
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
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
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {createModalVisible && (
        <View style={[StyleSheet.absoluteFillObject, styles.modalOverlay]}>
          <CreateSpaceForm
            onCreate={handleCreateSpace}
            onCancel={() => setCreateModalVisible(false)}
          />
        </View>
      )}
    </View>
  )
}

function SpacesFallback({
  searchQuery,
  setSearchQuery,
  setShowCreateModal,
}: {
  searchQuery?: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setShowCreateModal: (show: boolean) => void
}) {
  const details = getFallbackDetails(searchQuery)

  const handleActionButtonPress = () => {
    if (searchQuery) setSearchQuery("")
    else setShowCreateModal(true)
  }

  const handleSecondaryActionPress = () => {
    if (!searchQuery) return
    setSearchQuery("")
  }

  return (
    <View style={styles.emptyStateContainer}>
      <EmptyState
        icon={searchQuery ? Search : Box}
        title={details.title}
        description={details.description}
        actionTitle={details.actionTitle}
        onAction={handleActionButtonPress}
        secondaryActionTitle={details.secondaryActionTitle}
        onSecondaryAction={handleSecondaryActionPress}
        variant={details.variant as "search" | "default"}
        showFloatingElements={!searchQuery}
      />
    </View>
  )
}

function getFallbackDetails(searchQuery?: string) {
  const description = searchQuery
    ? `No spaces match "${searchQuery}". Try adjusting your search terms or create a new space.`
    : "Organize your legal documents by creating spaces. Group contracts, agreements, and other documents for better organization and faster access."

  const title = searchQuery ? "No Spaces Found" : "No Spaces Yet"
  const actionTitle = searchQuery ? "Create New Space" : "Create Your First Space"
  const secondaryActionTitle = searchQuery ? "Clear Search" : undefined
  const variant = searchQuery ? "search" : "default"

  return {
    title,
    description,
    actionTitle,
    secondaryActionTitle,
    variant,
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    padding: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  createButton: {
    padding: 8,
    borderRadius: 12,
  },
  searchContainer: {
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 100,
  },
  emptyStateContainer: {
    paddingTop: 120,
  },
})
