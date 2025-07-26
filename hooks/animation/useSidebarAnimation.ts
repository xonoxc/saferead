import React from "react"
import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated"

export function useSidebarAnimation(isSideBarOpen: boolean, SCREEN_WIDTH: number) {
  const translateX = useSharedValue(-SCREEN_WIDTH)

  React.useEffect(() => {
    translateX.value = withTiming(isSideBarOpen ? 0 : -SCREEN_WIDTH, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System ?? false,
    })
  }, [isSideBarOpen, translateX])

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  const mainContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + SCREEN_WIDTH }],
  }))

  return {
    sidebarStyle,
    mainContentStyle,
  }
}
