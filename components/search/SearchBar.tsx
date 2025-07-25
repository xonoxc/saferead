import { Fonts, FontSizes } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import { Filter, Search } from "lucide-react-native"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { TextInput } from "../TextInput"

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (text: string) => void
  placeholder?: string
  showFilter?: boolean
  onFilterPress?: () => void
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  showFilter = false,
  onFilterPress,
}: SearchHeaderProps) {
  const { colors } = useTheme()

  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.container}>
      <View style={[styles.searchBar, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          leftAccessory={<Search size={18} color={colors.textMuted} />}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        {showFilter && onFilterPress && (
          <TouchableOpacity
            style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onFilterPress}
          >
            <Filter size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingHorizontal: 8,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 0,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
  },
  filterBtn: {
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
})
