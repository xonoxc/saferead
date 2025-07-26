import React from "react"
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native"
import { Fonts } from "@/constants/Fonts"
import ConversationItem from "./ConversationItem"
import { useConversationTab } from "@/hooks/screens/useConverSationTab"

export default function ConversationsTab() {
  const { conversations, loading, error, colors } = useConversationTab()

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={styles.centered} />
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>{error.message}</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={conversations}
      renderItem={({ item }) => <ConversationItem item={item} />}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
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
