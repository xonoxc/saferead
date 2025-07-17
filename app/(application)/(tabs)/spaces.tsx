import { RelativePathString, router } from "expo-router"
import React, { useState } from "react"
import { View, StyleSheet, Alert, ScrollView } from "react-native"
import { Box, Folder, Search } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { useSpaces, useCreateSpace, useDeleteSpace } from "@/hooks/queries/spaces"
import { TextInput } from "@/components/TextInput"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpaceList } from "@/components/spaces/SpaceList"
import { CreateSpaceForm } from "@/components/spaces/CreateSpaceForm"
import { Space } from "@/types"
import { SpacePrivarcy } from "@/types/spaces"
import { EmptyState } from "@/components/EmptyState"

export default function SpacesScreen() {
  const { colors } = useTheme()
  const { data, isLoading } = useSpaces()
  const { mutate: createSpace } = useCreateSpace()
  const { mutate: deleteSpace } = useDeleteSpace()
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")

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
    icon: string,
    privacy: SpacePrivarcy,
    is_favorite: boolean
  ) => {
    createSpace({ title, description, color, icon, privacy, is_favorite })
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

  return (
    <View style={[styles.sidebarContent, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer]}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search spaces..."
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {spaces.length > 0 ? (
          <SpaceList
            spaces={filteredSpaces}
            onDelete={handleDeleteSpace}
            onSpaceSelect={handleSpaceSelectPress}
          />
        ) : (
          <SpacesFallback
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setShowCreateModal={() => setCreateModalVisible(false)}
          />
        )}
      </ScrollView>

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
  return (
    <View style={styles.emptyStateContainer}>
      <EmptyState
        icon={searchQuery ? Search : Box}
        title={searchQuery ? "No Spaces Found" : "No Spaces Yet"}
        description={
          searchQuery
            ? `No spaces match "${searchQuery}". Try adjusting your search terms or create a new space.`
            : "Organize your legal documents by creating spaces. Group contracts, agreements, and other documents for better organization and faster access."
        }
        actionTitle={searchQuery ? "Create New Space" : "Create Your First Space"}
        onAction={() => {
          if (searchQuery) setSearchQuery("")
          setShowCreateModal(true)
        }}
        secondaryActionTitle={searchQuery ? "Clear Search" : "Learn About Spaces"}
        onSecondaryAction={searchQuery ? () => setSearchQuery("") : () => {}}
        variant={searchQuery ? "search" : "default"}
        showFloatingElements={!searchQuery}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  sidebarContent: {
    flex: 1,
    padding: 2,
  },
  header: { paddingBottom: 10 },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  searchContainer: {
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 100,
  },
  content: {
    flex: 1,
    marginBottom: 10,
  },
  createButtonContainer: {
    marginTop: 16,
  },
  spacesFallbackContainer: {
    flex: 1,
    marginTop: 220,
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackCreateButton: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    paddingHorizontal: 14,
    flexDirection: "row",
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  emptyStateContainer: {
    paddingTop: 120,
  },
})
