import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"
import { X } from "lucide-react-native"

export const FilterHeader = ({ title, onClose }: { title: string; onClose: () => void }) => {
   const { colors } = useTheme()
   return (
      <View style={[styles.header, { backgroundColor: colors.background }]}>
         <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
         <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtnContainer, { borderColor: colors.border }]}
         >
            <X size={16} color={colors.text} />
            <Text style={[styles.closeBtn, { color: colors.text, borderColor: colors.border }]}>
               Close
            </Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
   },
   title: {
      fontSize: FontSizes.xl,
      fontFamily: Fonts.bold,
   },
   closeBtnContainer: {
      borderWidth: 1,
      padding: 9,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
   },
   closeBtn: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.bold,
   },
})
