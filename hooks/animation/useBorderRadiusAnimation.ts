import { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated"

export const useAnimatedBorderRadius = (initial: number, to: number, duration = 300) => {
  const radius = useSharedValue(initial)

  const animate = () => {
    radius.value = withTiming(to, { duration })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    borderRadius: radius.value,
  }))

  return { animatedStyle, animate, radius }
}
