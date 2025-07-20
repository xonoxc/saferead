import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import type { SettingsItem as Item } from "@/hooks/screens/useSettingsGroup"
import { Fonts, FontSizes } from "@/constants"

export default function SettingsItem({ item, isLast }: { item: Item; isLast: boolean }) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={item.onPress}
      style={[styles.item, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
          <item.icon size={20} color={item.danger ? colors.error : colors.textSecondary} />
        </View>
        <Text style={[styles.title, { color: item.danger ? colors.error : colors.text }]}>
          {item.title}
        </Text>
      </View>
      <View>
        {item.type === "toggle" ? (
          <Switch
            value={item.value as boolean}
            onValueChange={item.onPress}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        ) : (
          item.value && (
            <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{item.value}</Text>
          )
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  left: { flexDirection: "row", alignItems: "center" },
  itemValue: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
})
