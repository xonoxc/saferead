import { Fonts, FontSizes } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import { Filter, Search } from "lucide-react-native"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { TextInput } from "../TextInput"

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
      <View style={[styles.searchInputContainer, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text, gap: 8 }]}
          leftAccessory={<Search size={18} color={colors.textMuted} />}
          value={searchQuery}
          onChangeText={text => handleSearch(text)}
          placeholder="Search documents..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setShowFilter(true)}
        >
          <Filter size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingHorizontal: 8,
    gap: 8,
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
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
  },
  filterButton: {
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
})
