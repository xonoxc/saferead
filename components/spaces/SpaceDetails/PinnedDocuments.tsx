import React from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { UserSpaceDocumentCard } from "@/components/documents/UserSpaceDocumentCard"
import { UserSpaceDocument } from "@/types/api/spaces.documents.types"
import { ColorsType } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface PinnedDocumentsProps {
  documents: UserSpaceDocument[]
  spaceColor?: string
  colors: ColorsType
  onUnpinPress?: (docsId: string, docsFile: string) => void
}

export default function PinnedDocuments({
  documents,
  spaceColor,
  colors,
  onUnpinPress,
}: PinnedDocumentsProps) {
  if (documents.length === 0) return null

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Pinned Documents</Text>
      <FlatList
        data={documents}
        renderItem={({ item }) => (
          <UserSpaceDocumentCard
            pinned
            document={item}
            spaceColor={spaceColor}
            onPin={onUnpinPress}
          />
        )}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 10,
  },
})
