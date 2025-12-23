import { useTheme } from "@/hooks/useTheme"
import { useActiveFilterCount } from "@/store/useDocumentStore"
import { Filter, X } from "lucide-react-native"
import { StyleSheet, Pressable, View, Text } from "react-native"

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
   const activeFilterCount = useActiveFilterCount()

   return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
         {searchQuery.length > 0 && (
            <Pressable onPress={() => onSearchChange("")} style={styles.clearBtn}>
               <X size={18} color={colors.textMuted} strokeWidth={2.5} />
            </Pressable>
         )}
         {showFilter && onFilterPress && (
            <Pressable style={styles.filterBtn} onPress={onFilterPress}>
               <Filter size={18} color={colors.textMuted} />

               {!!activeFilterCount && activeFilterCount > 0 && (
                  <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
                     {activeFilterCount > 1 && (
                        <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                     )}
                  </View>
               )}
            </Pressable>
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
   filterBadge: {
      position: "absolute",
      top: 6,
      right: 6,
      minWidth: 8,
      height: 8,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
   },

   filterBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: "white",
   },
})
