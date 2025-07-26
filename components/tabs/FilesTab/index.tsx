import React from "react"
import { View, Text, FlatList, StyleSheet } from "react-native"
import { Fonts } from "@/constants/Fonts"
import { useTheme } from "@/hooks/useTheme"
import { EmptyState } from "@/components/EmptyState"
import { useSpaces } from "@/hooks/queries/spaces"
import { useSpaceStore } from "@/store/useSpaceStore"
import { File } from "lucide-react-native"
import FileItem from "./FileItem"

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

  return (
    <View style={styles.container}>
      <Text style={[styles.spaceTitle, { color: colors.text }]}>Files in {space?.title}</Text>
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
  list: {
    paddingTop: 16,
  },
  spaceTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 10,
  },
})
