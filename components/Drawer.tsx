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
}

const absoluteStyles: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  zIndex: 1000,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  overflow: "hidden",
}

export const Drawer: React.FC<DrawerProps> = ({ children, visible = true, enableAbsolute }) => {
  const { colors } = useTheme()

  if (!visible) return null

  const baseStyle: ViewStyle = {
    backgroundColor: colors.background,
    flex: 1,
  }

  const containerStyle: StyleProp<ViewStyle> = [
    enableAbsolute ? absoluteStyles : { flex: 1 },
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
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1 }}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  )
}
