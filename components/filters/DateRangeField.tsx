import { View, Text, StyleSheet } from "react-native"
import { TextInput } from "@/components/TextInput"
import { useTheme } from "@/hooks/useTheme"

import { Fonts, FontSizes } from "@/constants"

import type { FilterField } from "@/types/filter"

interface DateRangeFieldProps {
   field: FilterField
   from: string
   to: string
   onChange: (from: string, to: string) => void
}

export function DateRangeField({ field, from, to, onChange }: DateRangeFieldProps) {
   const { colors } = useTheme()
   return (
      <View style={styles.section}>
         <View style={styles.labelRow}>
            {field.icon}
            <Text style={[styles.label, { color: colors.textMuted }]}>{field.label}</Text>
         </View>
         <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
               value={from}
               onChangeText={(val: string) => onChange(val, to)}
               placeholder="From"
            />
            <TextInput
               value={to}
               onChangeText={(val: string) => onChange(from, val)}
               placeholder="To"
            />
         </View>
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
