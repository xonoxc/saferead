import { useEffect } from "react"
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"

export function useSlidingSelector(
  index: number,
  widthPerItem: number,
  duration = 200,
  borderRadius = 20
) {
  const translateX = useSharedValue(index * widthPerItem)

  useEffect(() => {
    translateX.value = withTiming(index * widthPerItem, { duration })
  }, [index, widthPerItem])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    borderRadius,
  }))

  return animatedStyle
}
