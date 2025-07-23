import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Box, ChevronsUpDown } from "lucide-react-native"
import DropdownSelector, { DropdownOption } from "@/components/DropDownSelector"
import { useSpaces } from "@/hooks/queries/spaces"
import { useSpaceStore } from "@/store/useSpaceStore"
import { Space } from "@/types"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

export function SpaceIndicator() {
  const { colors } = useTheme()
  const { selectedSpace, setSelectedSpace } = useSpaceStore()
  const { data, isLoading } = useSpaces()

  const spaces = data?.pages.flatMap(page => page.results) || []

  const options: DropdownOption<Space>[] = spaces.map(space => ({
    label: space.title,
    value: space,
    icon: <Box color={colors.text} size={18} />,
  }))

  const handleSelect = (space: Space) => {
    setSelectedSpace(space)
  }

  return (
    <DropdownSelector<Space>
      selected={selectedSpace as Space}
      options={options}
      onSelect={handleSelect}
      loading={isLoading}
      renderTrigger={(open, selectedOption) => (
        <TouchableOpacity
          onPress={open}
          style={[styles.trigger, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Box color={colors.text} size={18} />
          <Text style={[styles.triggerText, { color: colors.text }]}>
            {selectedOption?.label || selectedSpace?.title}
          </Text>
          <ChevronsUpDown size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    />
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 8,
    gap: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  triggerText: {
    marginLeft: 4,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
  },
})
