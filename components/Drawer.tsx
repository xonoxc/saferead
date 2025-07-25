import React, { ReactNode } from "react"
import Animated, { Easing, SlideInDown, SlideOutDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { StyleProp, ViewStyle } from "react-native"

interface DrawerProps {
  children: ReactNode
  visible: boolean
  enableAbsolute?: boolean
}

const absoluteStyles: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  overflow: "hidden",
}

export const Drawer: React.FC<DrawerProps> = ({ children, visible = true, enableAbsolute }) => {
  const { colors } = useTheme()

  if (!visible) return null

  const baseStyle = {
    backgroundColor: colors.background,
  }

  const containerStyle: StyleProp<ViewStyle> = [
    ...(enableAbsolute ? [absoluteStyles] : []),
    baseStyle,
  ]

  return (
    <Animated.View
      entering={SlideInDown.duration(200).easing(Easing.out(Easing.exp))}
      exiting={SlideOutDown.duration(200).easing(Easing.in(Easing.exp))}
      style={containerStyle}
    >
      {children}
    </Animated.View>
  )
}
