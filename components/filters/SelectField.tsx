import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"

import type { FilterField } from "@/types/filter"
import { Fonts, FontSizes } from "@/constants"
import { SelectableChip } from "./SelectableChip"

interface SelectFieldProps {
  field: FilterField
  value: any
  onChange: (val: any) => void
}

export function SelectField({ field, value, onChange }: SelectFieldProps) {
  const { colors } = useTheme()
  return (
    <View style={styles.section}>
      <View style={styles.labelRow}>
        {field.icon}
        <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
      </View>
      <View style={styles.optionsRow}>
        {field.options?.map((option: { label: string; value: any }) => (
          <SelectableChip
            key={option.value.toString()}
            label={option.label}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
          />
        ))}
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
  btnText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bold,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
})
