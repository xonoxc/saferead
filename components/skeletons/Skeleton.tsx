import React, { useEffect } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"
import { useTheme } from "@/hooks/useTheme"

interface SkeletonProps {
  width: number | string
  height: number | string
  borderRadius?: number
  style?: any
}

const Skeleton = ({ width, height, borderRadius = 4, style }: SkeletonProps) => {
  const { colors } = useTheme()
  const animatedValue = new Animated.Value(0)

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    )
    animation.start()
    return () => animation.stop()
  }, [])

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  })

  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius, backgroundColor: colors.skeletonBackground, ...style },
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          { backgroundColor: colors.skeletonShimmer, transform: [{ translateX }] },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: "hidden",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default Skeleton
