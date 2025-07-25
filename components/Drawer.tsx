import React, { ReactNode } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  View,
} from "react-native"
import Animated, { Easing, SlideInDown, SlideOutDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"

interface DrawerProps {
  children: ReactNode
  visible: boolean
  enableAbsolute?: boolean
  position?: "bottom" | "full"
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

const fullScreenStyles: ViewStyle = {
  ...absoluteStyles,
  top: 0,
}

export const Drawer: React.FC<DrawerProps> = ({
  children,
  visible = true,
  enableAbsolute,
  position,
}) => {
  const { colors } = useTheme()

  if (!visible) return null

  const baseStyle: ViewStyle = {
    backgroundColor: colors.background,
    flex: 1,
  }
  const drawerPosition = position ?? "full"

  const containerStyle: StyleProp<ViewStyle> = [
    ...(enableAbsolute ? [drawerPosition === "full" ? fullScreenStyles : absoluteStyles] : []),
    baseStyle,
  ]

  return (
    <Animated.View
      entering={SlideInDown.duration(200).easing(Easing.out(Easing.exp))}
      exiting={SlideOutDown.duration(200).easing(Easing.in(Easing.exp))}
      style={containerStyle}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1 }}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  )
}
