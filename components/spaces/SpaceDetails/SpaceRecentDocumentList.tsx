import { UserSpaceDocumentCard } from "@/components/documents/UserSpaceDocumentCard"
import { Fonts, FontSizes } from "@/constants"
import { View, StyleSheet, Text, FlatList } from "react-native"

export default function SpaceRecentDocumentList({
  documents,
  colors,
  spaceColor,
}: {
  documents: any[]
  colors: { text: string; background: string }
  spaceColor: string
}) {
  return (
    <View style={styles.documentsContainer}>
      <Text style={[styles.documentsTitle, { color: colors.text }]}>Recent Documents</Text>
      <FlatList
        data={documents}
        renderItem={({ item }) => (
          <UserSpaceDocumentCard document={item} spaceColor={spaceColor} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.documentsList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  documentsList: {
    paddingBottom: 100,
  },
  documentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  documentsTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    marginBottom: 10,
  },
})
