import { Fonts, FontSizes } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import { Filter, Search } from "lucide-react-native"
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

interface SidebarSearchProps {
  searchQuery: string
  handleSearch: (text: string) => void
  setShowFilter: (show: boolean) => void
}

export default function SidebarSearch({
  searchQuery,
  handleSearch,
  setShowFilter,
}: SidebarSearchProps) {
  const { colors } = useTheme()

  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchContainer}>
      <View
        style={[
          styles.searchInputContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Search size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={text => handleSearch(text)}
          placeholder="Search documents..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setShowFilter(true)}
      >
        <Filter size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 0,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
})
