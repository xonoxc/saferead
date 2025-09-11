import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useEffect } from "react"

import type { ViewStyle } from "react-native"

interface Props {
  isVisible: boolean
  children: React.ReactNode
  style?: ViewStyle
}

export function TabBarWrapper({ isVisible, children, style }: Props) {
  const translateY = useSharedValue(0)

  useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : 100, { duration: 250 })
  }, [isVisible])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: withTiming(isVisible ? 1 : 0),
  }))

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}
