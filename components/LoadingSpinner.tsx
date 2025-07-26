import { useTheme } from "@/hooks/useTheme"
import React from "react"
import { View, StyleSheet, Text } from "react-native"

import { Fonts, FontSizes } from "@/constants"

type FontFamilyOptions = keyof typeof Fonts
type FontSizeOptions = keyof typeof FontSizes

export const LoadingSpinner = ({
  FontSize,
  fontFamily,
}: {
  FontSize?: FontSizeOptions
  fontFamily?: FontFamilyOptions
}) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text
        style={{
          color: colors.text,
          fontSize: FontSize ? FontSizes[FontSize] : FontSizes.md,
          fontFamily: fontFamily ? Fonts[fontFamily] : Fonts.regular,
        }}
      >
        loading...
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
})
