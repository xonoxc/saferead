import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { type DropdownOption, DropdownSelector } from "@/components/DropDownSelector"
import type { Space } from "@/types"

interface SpaceSelectorProps {
  spaces: Space[]
  selectedSpace: Space | null
  onSelectSpace: (space: Space) => void
}

export function SpaceSelector({ spaces, selectedSpace, onSelectSpace }: SpaceSelectorProps) {
  const { colors } = useTheme()

  const spaceItems: DropdownOption<string>[] = spaces.map(space => ({
    label: space.name,
    value: space.id,
  }))

  const handleSelect = (item: { label: string; value: string }) => {
    const space = spaces.find(s => s.id === item.value)
    if (space) {
      onSelectSpace(space)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Select a Space</Text>
      <DropdownSelector
        label="Choose a space to chat with"
        options={spaceItems}
        onSelect={handleSelect}
        selected={selectedSpace?.id ?? ""}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
})
