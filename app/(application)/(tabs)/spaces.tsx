import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from "react-native"
import { Search, MoveVertical as MoreVertical } from "lucide-react-native"
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { useSpaces } from "@/hooks/useSpaces"
import { Button } from "@/components/Button"
import { TextInput } from "@/components/TextInput"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Fonts, FontSizes } from "@/constants/Fonts"

const icons = ["📁", "📄", "🤝", "🏢", "⚖️", "📋", "🔒", "📊", "💼", "📝"]
const colors_palette = ["#4ECDC4", "#FF6B6B", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]

export default function SpacesScreen() {
  const { colors } = useTheme()
  const { spaces, isLoading, createSpace, deleteSpace } = useSpaces()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSpaceName, setNewSpaceName] = useState("")
  const [newSpaceDescription, setNewSpaceDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState("#4ECDC4")
  const [selectedIcon, setSelectedIcon] = useState("📁")

  const filteredSpaces = spaces.filter(
    space =>
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) {
      Alert.alert("Error", "Please enter a space name")
      return
    }

    await createSpace(newSpaceName, newSpaceDescription, selectedColor, selectedIcon)

    setShowCreateModal(false)
    setNewSpaceName("")
    setNewSpaceDescription("")
    setSelectedColor("#4ECDC4")
    setSelectedIcon("📁")
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

  if (isLoading) {
    return <LoadingSpinner />
  }

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

      {/* My Spaces Section */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Spaces</Text>
      </Animated.View>

      {/* Spaces List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredSpaces.map((space, index) => (
          <Animated.View key={space.id} entering={FadeInRight.delay(400 + index * 100).springify()}>
            <TouchableOpacity
              style={[
                styles.spaceCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.spaceContent}>
                <View style={styles.spaceLeft}>
                  <View style={[styles.spaceIcon, { backgroundColor: `${space.color}20` }]}>
                    <Text style={styles.spaceEmoji}>{space.icon}</Text>
                  </View>
                  <View style={styles.spaceInfo}>
                    <Text style={[styles.spaceName, { color: colors.text }]}>{space.name}</Text>
                    <Text style={[styles.spaceDescription, { color: colors.textSecondary }]}>
                      {space.documentCount} documents
                    </Text>
                  </View>
                </View>
                <View style={styles.spaceRight}>
                  <View style={[styles.spacePreview, { backgroundColor: space.color + "20" }]}>
                    <View style={[styles.previewShape, { backgroundColor: space.color }]} />
                  </View>
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => handleDeleteSpace(space.id, space.name)}
                  >
                    <MoreVertical size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Create New Space Button */}
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

      {/* Create Space Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Space</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.cancelButton, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              label="Space Name"
              value={newSpaceName}
              onChangeText={setNewSpaceName}
              placeholder="Enter space name"
            />

            <TextInput
              label="Description (Optional)"
              value={newSpaceDescription}
              onChangeText={setNewSpaceDescription}
              placeholder="Enter space description"
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.sectionLabel, { color: colors.text }]}>Choose Color</Text>
            <View style={styles.colorGrid}>
              {colors_palette.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <Text style={[styles.sectionLabel, { color: colors.text }]}>Choose Icon</Text>
            <View style={styles.iconGrid}>
              {icons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    { backgroundColor: colors.surface },
                    selectedIcon === icon && { backgroundColor: colors.primary + "20" },
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Create Space"
              onPress={handleCreateSpace}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
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
    paddingHorizontal: 0,
    paddingLeft: 12,
    width: "100%",
    borderWidth: 1,
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
  spaceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  spaceContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  spaceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  spaceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  spaceEmoji: {
    fontSize: 24,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceName: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  spaceDescription: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  spaceRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacePreview: {
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  previewShape: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  moreButton: {
    padding: 4,
  },
  createButtonContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
  },
  cancelButton: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginTop: 24,
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 24,
  },
  modalFooter: {
    padding: 20,
    paddingBottom: 40,
  },
})
