import React from "react"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export function useSidebarAnimation(isSideBarOpen: boolean, SCREEN_WIDTH: number) {
  const translateX = useSharedValue(-SCREEN_WIDTH)

  React.useEffect(() => {
    translateX.value = withSpring(isSideBarOpen ? 0 : -SCREEN_WIDTH, {
      damping: 20,
      stiffness: 130,
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
