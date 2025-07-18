import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { iconMap, SpaceIconName } from "@/constants/spaceform"
import { Box } from "lucide-react-native"

type SpaceIconProps = {
  name: SpaceIconName
  color?: string
  size?: number
  background?: boolean
}

export default function SpaceIcon({
  name,
  color = "#000",
  size = 20,
  background = false,
}: SpaceIconProps) {
  const Icon = iconMap[name]

  console.log("Rendering SpaceIcon:", name, Icon)

  if (!Icon) {
    return (
      <View style={[styles.iconWrapper, background && { backgroundColor: `${color}20` }]}>
        <Text style={{ color }}>
          <Box />
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.iconWrapper, background && { backgroundColor: `${color}20` }]}>
      <Icon size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
})
