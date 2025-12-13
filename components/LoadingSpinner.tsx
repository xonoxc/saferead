import { useTheme } from "@/hooks/useTheme"
import React from "react"
import { View, StyleSheet, Text } from "react-native"

import { Fonts, FontSizes } from "@/constants"

type FontFamilyOptions = keyof typeof Fonts
type FontSizeOptions = keyof typeof FontSizes

interface LoadingSpinnerProps {
   FontSize?: FontSizeOptions
   fontFamily?: FontFamilyOptions
   loaderMessage?: string
}

export const LoadingSpinner = ({ FontSize, fontFamily, loaderMessage }: LoadingSpinnerProps) => {
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
            {loaderMessage ? loaderMessage : "Loading..."}
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
