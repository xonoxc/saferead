import React, { useEffect } from "react"
import { View, StyleSheet, type DimensionValue } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withRepeat,
   withTiming,
   interpolate,
} from "react-native-reanimated"

import { useTheme } from "@/hooks/useTheme"

interface SkeletonProps {
   width: DimensionValue
   height: DimensionValue
   borderRadius?: number
   style?: any
}

const SHIMMER_DURATION = 1400

/*
 * Placeholder block with a highlight that sweeps across it.
 *
 * The shimmer layer existed before but was a static translucent overlay, so
 * loading states sat perfectly still and read as frozen rather than pending.
 * **/
const Skeleton = ({ width, height, borderRadius = 6, style }: SkeletonProps) => {
   const { colors } = useTheme()
   const progress = useSharedValue(0)
   const [blockWidth, setBlockWidth] = React.useState(0)

   useEffect(() => {
      progress.value = withRepeat(
         withTiming(1, { duration: SHIMMER_DURATION, easing: Easing.inOut(Easing.ease) }),
         -1,
         false
      )
   }, [])

   const shimmerStyle = useAnimatedStyle(() => ({
      transform: [
         {
            // Travel a full width past each edge so the highlight enters and
            // exits cleanly instead of popping at the boundaries.
            translateX: interpolate(progress.value, [0, 1], [-blockWidth, blockWidth]),
         },
      ],
   }))

   return (
      <View
         onLayout={event => setBlockWidth(event.nativeEvent.layout.width)}
         style={[
            styles.skeleton,
            {
               width,
               height,
               borderRadius,
               backgroundColor: colors.skeletonBackground,
            },
            style,
         ]}
      >
         {blockWidth > 0 && (
            <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
               <LinearGradient
                  colors={["transparent", colors.skeletonShimmer, "transparent"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
               />
            </Animated.View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   skeleton: {
      overflow: "hidden",
   },
})

export default Skeleton
