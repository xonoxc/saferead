import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

export const SelectableChip = ({
   label,
   selected,
   onPress,
}: {
   label: string
   selected: boolean
   onPress: () => void
}) => {
   const { colors } = useTheme()
   return (
      <TouchableOpacity
         onPress={onPress}
         style={[
            styles.chip,
            {
               backgroundColor: selected ? colors.primary : colors.card,
               borderColor: selected ? colors.primary : colors.border,
            },
         ]}
      >
         <Text style={[styles.chipText, { color: selected ? colors.background : colors.text }]}>
            {label}
         </Text>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   chip: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      marginRight: 8,
      marginBottom: 10,
   },
   chipText: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.regular,
   },
})
