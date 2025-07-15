import React, { useState } from "react"
import { View, ScrollView, Alert, Modal, StyleSheet } from "react-native"
import { Search } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useSpaces } from "@/hooks/useSpaces"
import { TextInput } from "@/components/TextInput"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpaceList } from "@/components/spaces/SpaceList"
import { CreateSpaceForm } from "@/components/spaces/CreateSpaceForm"
import { Fonts, FontSizes } from "@/constants/Fonts"

export function SpacesSidebarContent({
  showCreateModal,
  onCreateFormClose,
}: {
  showCreateModal: boolean
  onCreateFormClose: () => void
}) {
  const { colors } = useTheme()
  const { spaces, isLoading, createSpace, deleteSpace } = useSpaces()

  const [searchQuery, setSearchQuery] = useState("")

  const filteredSpaces = spaces.filter(
    space =>
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateSpace = async (
    name: string,
    description: string,
    color: string,
    icon: string
  ) => {
    await createSpace(name, description, color, icon)
    onCreateFormClose()
  }

  const handleDeleteSpace = (spaceId: string, spaceName: string) => {
    Alert.alert("Delete Space", `Are you sure you want to delete "${spaceName}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteSpace(spaceId) },
    ])
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
        <SpaceList spaces={filteredSpaces} onDelete={handleDeleteSpace} />
      </ScrollView>

      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <CreateSpaceForm onCreate={handleCreateSpace} onCancel={onCreateFormClose} />
      </Modal>
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
  content: {
    flex: 1,
    marginBottom: 20,
  },
  createButtonContainer: {
    marginTop: 16,
  },
})
