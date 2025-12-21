import { StyleSheet, TouchableOpacity } from "react-native"
import { Edit3, X } from "lucide-react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import { CustomBackBtn } from "@/components/CustomBackBtn"

interface Props {
   isEditing: boolean
   onEdit: () => void
   onCancel: () => void
}

export function ProfileHeader({ isEditing, onEdit, onCancel }: Props) {
   const { colors } = useTheme()

   return (
      <Animated.View
         entering={FadeInDown.springify()}
         style={[styles.header, { backgroundColor: colors.background }]}
      >
         <CustomBackBtn />

         <TouchableOpacity
            style={[
               styles.editBtn,
               { backgroundColor: isEditing ? colors.error + "15" : colors.primary + "15" },
            ]}
            onPress={isEditing ? onCancel : onEdit}
         >
            {isEditing ? (
               <X size={18} color={colors.error} />
            ) : (
               <Edit3 size={18} color={colors.primary} />
            )}
         </TouchableOpacity>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      justifyContent: "space-between",
      paddingBottom: 10,
   },
   editBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      justifyContent: "center",
      alignItems: "center",
   },
})
