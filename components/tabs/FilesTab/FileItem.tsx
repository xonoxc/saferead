import { Fonts } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import { View, Text, StyleSheet } from "react-native"

import type { UserSpaceDocument } from "@/types/api/spaces.documents.types"

export default function FileItem({ item }: { item: UserSpaceDocument }) {
  const { colors } = useTheme()

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.itemTitle, { color: colors.text }]}>{item?.display_name}</Text>
      <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  itemSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
})
