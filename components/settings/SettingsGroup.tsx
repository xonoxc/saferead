import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import SettingsItem from "./SettingsItem"
import type { SettingsGroup as Group } from "@/hooks/screens/useSettingsGroup"
import { Fonts, FontSizes } from "@/constants"

export default function SettingsGroup({ group }: { group: Group }) {
   const { colors } = useTheme()

   return (
      <View style={styles.group}>
         <Text style={[styles.groupTitle, { color: colors.textMuted }]}>{group.title}</Text>
         <View style={[styles.groupItems, { backgroundColor: colors.background }]}>
            {group.items.map((item, idx) => (
               <SettingsItem key={idx} item={item} isLast={idx === group.items.length - 1} />
            ))}
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   group: {
      marginBottom: 32,
   },
   groupTitle: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.semiBold,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
   },
   groupItems: {
      borderRadius: 12,
      overflow: "hidden",
   },
})
