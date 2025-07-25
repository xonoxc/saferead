import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "@/hooks/useTheme"

import type { FilterField } from "@/types/filter"

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
          <TouchableOpacity
            key={option.value.toString()}
            onPress={() => onChange(option.value)}
            style={{
              backgroundColor: value === option.value ? colors.primary : colors.card,
              borderColor: colors.border,
              padding: 8,
              borderRadius: 8,
              marginRight: 8,
            }}
          >
            <Text style={{ color: value === option.value ? colors.background : colors.text }}>
              {option.label}
            </Text>
          </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: "500",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
})
