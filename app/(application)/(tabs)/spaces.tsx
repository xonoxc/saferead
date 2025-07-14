import React, { useState } from "react"
import { View, Text, Modal, StyleSheet, ScrollView, Alert } from "react-native"
import { Search } from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import { useSpaces } from "@/hooks/useSpaces"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { SpaceList } from "@/components/SpaceList"
import { CreateSpaceForm } from "@/components/CreateSpaceForm"

import { Fonts, FontSizes } from "@/constants/Fonts"

export default function SpacesScreen() {
  const { colors } = useTheme()
  const { spaces, isLoading, createSpace, deleteSpace } = useSpaces()

  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

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
    setShowCreateModal(false)
  }

  const handleDeleteSpace = (spaceId: string, spaceName: string) => {
    Alert.alert(
      "Delete Space",
      `Are you sure you want to delete "${spaceName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteSpace(spaceId) },
      ]
    )
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Spaces</Text>
      </Animated.View>

      {/* Search */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search spaces..."
          />
        </View>
      </Animated.View>

      {/* My Spaces Label */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Spaces</Text>
      </Animated.View>

      {/* Spaces List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SpaceList spaces={filteredSpaces} onDelete={handleDeleteSpace} />
      </ScrollView>

      {/* Create Button */}
      <Animated.View
        entering={FadeInDown.delay(600).springify()}
        style={styles.createButtonContainer}
      >
        <Button
          title="Create New Space"
          onPress={() => setShowCreateModal(true)}
          variant="primary"
          size="large"
          fullWidth
        />
      </Animated.View>

      {/* Create Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <CreateSpaceForm onCreate={handleCreateSpace} onCancel={() => setShowCreateModal(false)} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  createButtonContainer: {
    padding: 20,
    paddingBottom: 100,
  },
})
