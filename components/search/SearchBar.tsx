import { Fonts, FontSizes } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import { Search } from "lucide-react-native"
import { View, StyleSheet } from "react-native"
import { TextInput } from "@/components/TextInput"
import SearchRightAccessory from "@/components/search/SearchRightAccessory"

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
      <View style={styles.container}>
         <View style={[styles.searchBar, { borderColor: colors.vio }]}>
            <TextInput
               style={[styles.input, { color: colors.text }]}
               leftAccessory={<Search size={18} color={colors.textMuted} />}
               rightAccessory={
                  <SearchRightAccessory
                     searchQuery={searchQuery}
                     onSearchChange={searchQuery => onSearchChange(searchQuery)}
                     showFilter={showFilter}
                     onFilterPress={onFilterPress}
                  />
               }
               value={searchQuery}
               onChangeText={onSearchChange}
               placeholder={placeholder}
               placeholderTextColor={colors.textMuted}
               returnKeyType="search"
               clearButtonMode="while-editing"
            />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 10,
      paddingHorizontal: 2,
      gap: 8,
   },
   searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
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
})
