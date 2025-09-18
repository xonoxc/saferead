import React from "react"
import { Text, TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

interface PromptChipProps {
   label: string
   onPress?: (text: string) => void
}

export const PromptChip = ({ label, onPress }: PromptChipProps) => {
   const { colors } = useTheme()

   return (
      <TouchableOpacity
         style={[styles.chip, { backgroundColor: colors.background, borderColor: colors.border }]}
         onPress={() => onPress?.(label)}
         activeOpacity={0.7}
      >
         <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   chip: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderRadius: 10,
      margin: 6,
   },
   text: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.semiBold,
   },
})
