import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"

import DropdownSelector, { type DropdownOption } from "@/components/DropDownSelector"

import type { Space } from "@/types"

interface SpaceSelectorProps {
   spaces: Space[]
   selectedSpace: Space | null
   onSelectSpace: (space: Space) => void
}

export function SpaceSelector({ spaces, selectedSpace, onSelectSpace }: SpaceSelectorProps) {
   const { colors } = useTheme()

   const spaceItems: DropdownOption<string>[] = spaces.map(space => ({
      label: space.title,
      value: space.id,
   }))

   return (
      <View style={styles.container}>
         <Text style={[styles.label, { color: colors.text }]}>Select a Space</Text>

         <DropdownSelector<string>
            label="Choose a space to chat with"
            options={spaceItems}
            selected={selectedSpace?.id ?? ""}
            onSelect={spaceId => {
               const space = spaces.find(s => s.id === spaceId)
               if (space) {
                  onSelectSpace(space)
               }
            }}
            triggerText="No Space Selected"
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
