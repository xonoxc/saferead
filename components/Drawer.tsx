import React, { ReactNode } from "react"
import { StyleSheet } from "react-native"
import { Easing, SlideInDown, SlideOutDown } from "react-native-reanimated"
import Animated from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"

interface DrawerProps {
  children: ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const { colors } = useTheme()

  return (
    <Animated.View
      entering={SlideInDown.duration(200).easing(Easing.out(Easing.exp))}
      exiting={SlideOutDown.duration(200).easing(Easing.in(Easing.exp))}
      style={[styles.drawer, { backgroundColor: colors.background }]}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
})
