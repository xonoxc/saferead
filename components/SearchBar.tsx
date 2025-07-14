import React from "react"
import { View, StyleSheet } from "react-native"
import { Search } from "lucide-react-native"
import { TextInput } from "./TextInput"
import { useTheme } from "@/hooks/useTheme"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Search size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
      <TextInput value={value} onChangeText={onChangeText} placeholder="Search documents..." />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
})
