import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withDelay,
   withRepeat,
   withSequence,
   withTiming,
   interpolate,
} from "react-native-reanimated"

import { Fonts, FontSizes } from "@/constants"
import { Spacing } from "@/constants/Design"
import { useTheme } from "@/hooks/useTheme"

const DOT_COUNT = 3
const DOT_DURATION = 420

/*
 * Animated typing indicator.
 *
 * This was previously the static string "Thinking...." in hardcoded white,
 * which was invisible against a light background and gave no sense that
 * anything was actually happening.
 * **/
export default function ResponseLoader() {
   const { colors } = useTheme()

   return (
      <View style={styles.container}>
         <View style={styles.dots}>
            {Array.from({ length: DOT_COUNT }).map((_, index) => (
               <Dot key={index} index={index} color={colors.textSecondary} />
            ))}
         </View>
         <Text style={[styles.text, { color: colors.textSecondary }]}>Reading your documents</Text>
      </View>
   )
}

function Dot({ index, color }: { index: number; color: string }) {
   const progress = useSharedValue(0)

   useEffect(() => {
      progress.value = withDelay(
         index * (DOT_DURATION / DOT_COUNT),
         withRepeat(
            withSequence(
               withTiming(1, { duration: DOT_DURATION, easing: Easing.out(Easing.quad) }),
               withTiming(0, { duration: DOT_DURATION, easing: Easing.in(Easing.quad) })
            ),
            -1,
            false
         )
      )
   }, [index, progress])

   const animatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0.3, 1]),
      transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -3]) }],
   }))

   return <Animated.View style={[styles.dot, { backgroundColor: color }, animatedStyle]} />
}

const styles = StyleSheet.create({
   container: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
   },
   dots: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
   },
   text: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.medium,
   },
})
