import { Fonts, FontSizes } from "@/constants"
import { useTheme } from "@/hooks/useTheme"
import React from "react"
import { Text, StyleSheet } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

export default function DocumentTabErrorMessage({ error }: { error: Error | null }) {
   const { colors } = useTheme()
   return (
      <>
         {error?.message && (
            <Animated.View
               entering={FadeInDown.delay(300).springify()}
               style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}
            >
               <Text style={[styles.errorText, { color: colors.error }]}>{error.message}</Text>
            </Animated.View>
         )}
      </>
   )
}

const styles = StyleSheet.create({
   errorContainer: {
      margin: 20,
      padding: 12,
      borderRadius: 8,
   },
   errorText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.medium,
      textAlign: "center",
   },
})
