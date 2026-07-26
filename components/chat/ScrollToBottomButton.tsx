import React from "react"
import { Pressable, StyleSheet } from "react-native"
import { ChevronDown } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { withAlpha } from "@/constants/Design"

interface ScrollToBottomButtonProps {
   onPress: () => void
   visible: boolean
}

/*
 * Scroll-to-bottom pill: appears when user scrolls up in a long chat,
 * vanishes on scroll down or tap.
 *
 * Position is centered horizontally above the compose area, subtle until hovered.
 * **/
export const ScrollToBottomButton = ({ onPress, visible }: ScrollToBottomButtonProps) => {
   const { colors } = useTheme()
   const opacity = useSharedValue(0)

   React.useEffect(() => {
      opacity.value = withTiming(visible ? 1 : 0, {
         duration: visible ? 150 : 400,
      })
   }, [visible])

   const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
         { scale: 0.95 + opacity.value * 0.05 },
         { translateY: (1 - opacity.value) * 8 },
      ],
   }))

   return (
      <Animated.View
         pointerEvents={visible ? "auto" : "none"}
         style={[styles.container, animatedStyle]}
      >
         <Pressable
            style={[
               styles.button,
               {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.text,
               },
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel="Scroll to newest message"
            hitSlop={8}
         >
            <ChevronDown size={16} color={colors.primary} strokeWidth={2.5} />
         </Pressable>
      </Animated.View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: "absolute",
      bottom: 100,
      left: "50%",
      marginLeft: -22,
      zIndex: 10,
   },
   button: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
   },
})
