import { useTheme } from "@/hooks/useTheme"
import { View, Text, StyleSheet } from "react-native"
import { Fonts } from "@/constants"

import type { Conversation } from "@/types/api/conversations.types"

export default function ConversationItem({ item }: { item: Conversation }) {
  const { colors } = useTheme()

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
        Space: {item.space_title}
      </Text>
      <Text style={[styles.itemSubtitle, { color: colors.secondary }]}>
        {item.message_count} messages
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
})
