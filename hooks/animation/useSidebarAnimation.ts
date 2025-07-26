import React from "react"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export function useLayoutSlideAnimation(isSideOpen: boolean, SCREEN_WIDTH: number) {
  const translateX = useSharedValue(-SCREEN_WIDTH)

  React.useEffect(() => {
    translateX.value = withSpring(isSideOpen ? 0 : -SCREEN_WIDTH, {
      damping: 20,
      stiffness: 130,
    })
  }, [isSideOpen, translateX])

  const sideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  const mainContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + SCREEN_WIDTH }],
  }))

  return {
    sideStyle,
    mainContentStyle,
  }
}
