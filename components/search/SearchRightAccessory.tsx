import { useTheme } from "@/hooks/useTheme"
import { Filter, X } from "lucide-react-native"
import { StyleSheet, TouchableOpacity, View } from "react-native"

interface SearchRightAccessoryProps {
   searchQuery: string
   onSearchChange: (text: string) => void
   showFilter?: boolean
   onFilterPress?: () => void
}

export default function SearchRightAccessory({
   searchQuery,
   onSearchChange,
   showFilter = false,
   onFilterPress,
}: SearchRightAccessoryProps) {
   const { colors } = useTheme()

   return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
         {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange("")} style={styles.clearBtn}>
               <X size={18} color={colors.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
         )}
         {showFilter && onFilterPress && (
            <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
               <Filter size={18} color={colors.textMuted} />
            </TouchableOpacity>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   clearBtn: {
      borderRadius: 12,
      padding: 14,
      paddingHorizontal: 12,
      justifyContent: "center",
      alignItems: "center",
   },
   filterBtn: {
      borderRadius: 12,
      padding: 14,
      paddingHorizontal: 12,
      justifyContent: "center",
      alignItems: "center",
   },
})
