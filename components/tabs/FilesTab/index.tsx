import React from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { useTheme } from "@/hooks/useTheme"
import { EmptyState } from "@/components/EmptyState"
import { useSpaces } from "@/hooks/queries/spaces"
import { useSpaceStore } from "@/store/useSpaceStore"
import { File, FilePlus } from "lucide-react-native"
import FileItem from "./FileItem"
import { router } from "expo-router"

export default function FilesTab() {
  const { colors } = useTheme()
  const activeSpace = useSpaceStore(s => s.selectedSpace)

  const { data, isLoading, error } = useSpaces()
  const space = data?.pages.flatMap(page => page.results).find(s => s.id === activeSpace?.id)

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>Loading files...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>Failed to load files.</Text>
      </View>
    )
  }

  if (space?.document_count === 0) {
    return (
      <EmptyState
        title="No Files"
        description="There are no files in this space yet."
        icon={File}
      />
    )
  }

  const handleAddDocument = () => {
    if (!activeSpace?.id) return
    router.push(`/spaces/${activeSpace.id}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.spaceTitleContainer}>
        <View style={styles.header}>
          {true && (
            <TouchableOpacity
              style={[
                styles.addDocumentButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={handleAddDocument}
            >
              <FilePlus size={24} color={colors.text} />
              <Text
                style={[
                  styles.addDocumentButtonText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Add File
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={space?.recent_documents}
        renderItem={({ item }) => <FileItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 30,
    marginBottom: 1,
  },
  addDocumentButton: {
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 5,
    justifyContent: "center",
    borderRadius: 12,
  },

  addDocumentButtonText: {
    flexDirection: "row",
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xs,
  },
  list: {
    paddingTop: 16,
  },
  spaceTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  spaceTitle: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 10,
  },
})
