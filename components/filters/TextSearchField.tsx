import { View, Text, StyleSheet } from "react-native"
import { TextInput } from "@/components/TextInput"
import { useTheme } from "@/hooks/useTheme"

import { Fonts, FontSizes } from "@/constants"

import type { FilterField } from "@/types/filter"

interface TextSearchFieldProps {
   field: FilterField
   value: string
   onChange: (val: string) => void
}

export function TextSearchField({ field, value, onChange }: TextSearchFieldProps) {
   const { colors } = useTheme()
   return (
      <View style={styles.section}>
         <View style={styles.labelRow}>
            {field.icon}
            <Text style={[styles.label, { color: colors.textMuted }]}>{field.label}</Text>
         </View>
         <TextInput
            value={value}
            onChangeText={(val: string) => onChange(val)}
            placeholder={`Search ${field.label}`}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   section: {
      marginBottom: 20,
   },
   labelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
   },
   label: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.bold,
   },
})
