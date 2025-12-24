import React from "react"
import { Pressable, StyleSheet } from "react-native"
import { ArrowDown } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"

interface ScrollToBottomButtonProps {
   onPress: () => void
   visible: boolean
}

export const ScrollToBottomButton = ({ onPress, visible }: ScrollToBottomButtonProps) => {
   const { colors } = useTheme()
   const opacity = useSharedValue(0)

   React.useEffect(() => {
      opacity.value = withTiming(visible ? 1 : 0, {
         duration: visible ? 100 : 500,
      })
   }, [visible])

   const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: 0.9 + opacity.value * 0.1 }, { translateY: (1 - opacity.value) * 6 }],
   }))

   return (
      <Animated.View
         pointerEvents={visible ? "auto" : "none"}
         style={[styles.container, animatedStyle]}
      >
         <Pressable
            style={[
               styles.button,
               { backgroundColor: colors.textMuted, borderColor: colors.border },
            ]}
            onPress={onPress}
            accessibilityRole="button"
         >
            <ArrowDown size={12} color={colors.background} strokeWidth={4} />
         </Pressable>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: "absolute",
      bottom: 80,
      right: "45%",
      borderWidth: 1,
      zIndex: 10,
   },
   button: {
      padding: 10,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      elevation: 1, // Shadow for Android
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
   },
})
