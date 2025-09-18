import { Globe, LockIcon } from "lucide-react-native"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useSlidingSelector } from "@/hooks/animation/useSlidingSelector"
import { useTheme } from "@/hooks/useTheme"
import Animated from "react-native-reanimated"
import { Fonts } from "@/constants"

import type { ControllerRenderProps } from "react-hook-form"

interface PrivacySelectorProps {
   field: ControllerRenderProps<any, "privacy">
}

const options = ["private", "public"]

export default function SpacePrivacySelector({ field: { value, onChange } }: PrivacySelectorProps) {
   const { colors } = useTheme()

   const index = options.indexOf(value)
   const bgStyle = useSlidingSelector({
      index,
      widthPerItem: index => index * 160,
   })

   return (
      <View style={[styles.privacyContainer, { backgroundColor: colors.background }]}>
         <Animated.View
            style={[
               StyleSheet.absoluteFill,
               {
                  width: "50%",
                  height: "100%",
                  backgroundColor: colors.primary,
               },
               bgStyle,
            ]}
         />
         {options.map(option => {
            const Icon = option === "private" ? LockIcon : Globe
            const isSelected = value === option
            const iconColor = isSelected ? colors.background : colors.text
            const textColor = isSelected ? colors.card : colors.text

            return (
               <TouchableOpacity
                  key={option}
                  style={[styles.privacyOption]}
                  onPress={() => onChange(option)}
               >
                  <Icon size={14} color={iconColor} />
                  <Text
                     style={{
                        color: textColor,
                        fontFamily: Fonts.medium,
                        marginLeft: 6,
                     }}
                  >
                     {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
               </TouchableOpacity>
            )
         })}
      </View>
   )
}

const styles = StyleSheet.create({
   privacyContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginBottom: 20,
   },
   privacyOption: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      padding: 12,
      borderRadius: 20,
      alignItems: "center",
   },
})
