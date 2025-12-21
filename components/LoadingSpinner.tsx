import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withRepeat,
   withTiming,
   interpolate,
} from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

type FontFamilyOptions = keyof typeof Fonts
type FontSizeOptions = keyof typeof FontSizes

interface LoadingSpinnerProps {
   fontSize?: FontSizeOptions
   fontFamily?: FontFamilyOptions
   loaderMessage?: string
}

const DOT_COUNT = 3

export function LoadingSpinner({
   fontSize = "md",
   fontFamily = "regular",
   loaderMessage = "Loading...",
}: LoadingSpinnerProps) {
   const { colors } = useTheme()

   const progress = useSharedValue(0)

   useEffect(() => {
      progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false)
   }, [])

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={styles.dotsRow}>
            {Array.from({ length: DOT_COUNT }).map((_, index) => {
               const animatedStyle = useAnimatedStyle(() => {
                  const delay = index / DOT_COUNT
                  const opacity = interpolate(
                     (progress.value + delay) % 1,
                     [0, 0.5, 1],
                     [0.3, 1, 0.3]
                  )

                  const scale = interpolate(
                     (progress.value + delay) % 1,
                     [0, 0.5, 1],
                     [0.8, 1.2, 0.8]
                  )

                  return {
                     opacity,
                     transform: [{ scale }],
                  }
               })

               return (
                  <Animated.View
                     key={index}
                     style={[styles.dot, { backgroundColor: colors.primary }, animatedStyle]}
                  />
               )
            })}
         </View>

         <Text
            style={[
               styles.message,
               {
                  color: colors.text,
                  fontSize: FontSizes[fontSize],
                  fontFamily: Fonts[fontFamily],
               },
            ]}
         >
            {loaderMessage}
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
   dotsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
   },
   dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
   },
   message: {
      textAlign: "center",
      opacity: 0.85,
   },
})
