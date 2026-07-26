import React from "react"
import { Text, View, Pressable, StyleSheet } from "react-native"
import { ChevronDown } from "lucide-react-native"
import { useSpaces } from "@/hooks/queries/spaces"
import { useSpaceStore } from "@/store/useSpaceStore"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { Radii, Spacing, withAlpha } from "@/constants/Design"

import DropdownSelector, { type DropdownOption } from "@/components/DropDownSelector"
import SpaceIcon from "@/components/spaces/Icon"

import type { Space } from "@/types"
import type { SpaceIconName } from "@/constants/spaceform"

/*
 * The space you are chatting with, as a compact pill.
 *
 * This used to sit in a full-bleed bar with a dashed border and its label
 * clamped to 55px, which read as an unfinished form field stretched across the
 * screen. A pill that hugs its title - tinted with the space's own colour, and
 * carrying that colour as a dot - says the same thing as a deliberate part of
 * the header instead.
 * **/
export function SpaceIndicator() {
   const { colors } = useTheme()
   const { selectedSpace, setSelectedSpace } = useSpaceStore()
   const { data, isLoading } = useSpaces()

   const spaces = data?.pages.flatMap(page => page.results) || []

   const options: DropdownOption<Space>[] = spaces.map(space => ({
      label: space.title,
      value: space,
      icon: <SpaceIcon name={space.icon as SpaceIconName} size={18} color={space.color} />,
   }))

   const handleSelect = (space: Space) => setSelectedSpace(space)

   const accent = selectedSpace?.color || colors.primary

   return (
      <DropdownSelector<Space>
         selected={selectedSpace as Space}
         options={options}
         onSelect={handleSelect}
         loading={isLoading}
         renderTrigger={(open, selectedOption) => (
            <Pressable
               onPress={open}
               style={({ pressed }) => [
                  styles.trigger,
                  {
                     backgroundColor: withAlpha(accent, pressed ? 0.2 : 0.11),
                     borderColor: withAlpha(accent, 0.28),
                  },
               ]}
               accessibilityRole="button"
               accessibilityLabel={`Current space: ${
                  selectedOption?.label || selectedSpace?.title || "none"
               }. Tap to switch space.`}
            >
               <View style={[styles.dot, { backgroundColor: accent }]} />

               <Text
                  style={[styles.triggerText, { color: colors.text }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
               >
                  {selectedOption?.label || selectedSpace?.title}
               </Text>

               <ChevronDown size={15} color={colors.textMuted} strokeWidth={2.5} />
            </Pressable>
         )}
      />
   )
}

const styles = StyleSheet.create({
   trigger: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      gap: Spacing.xs,
      paddingVertical: 7,
      paddingLeft: Spacing.sm,
      paddingRight: Spacing.xs + 2,
      borderRadius: Radii.pill,
      borderWidth: 1,
      /* Hugs its title, but never crowds the icons on either side of it. */
      maxWidth: 200,
   },
   dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
   },
   triggerText: {
      flexShrink: 1,
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
   },
})
