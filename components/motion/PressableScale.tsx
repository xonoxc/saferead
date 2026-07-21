import React from "react"
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native"
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
} from "react-native-reanimated"

import { Motion } from "@/constants/Design"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface PressableScaleProps extends PressableProps {
   children: React.ReactNode
   style?: StyleProp<ViewStyle>
   /* How far to shrink while held. Lower = more pronounced. */
   scaleTo?: number
   /* Dim slightly on press, for flat surfaces where scale alone reads weakly. */
   dim?: boolean
}

/*
 * A Pressable that springs inward when held.
 *
 * Touch feedback was previously inconsistent - some controls used opacity,
 * many had none at all, which made the app feel unresponsive on device.
 * **/
export function PressableScale({
   children,
   style,
   scaleTo = Motion.pressScale,
   dim = false,
   onPressIn,
   onPressOut,
   ...rest
}: PressableScaleProps) {
   const scale = useSharedValue(1)
   const opacity = useSharedValue(1)

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
   }))

   return (
      <AnimatedPressable
         style={[style, animatedStyle]}
         onPressIn={event => {
            scale.value = withSpring(scaleTo, Motion.springQuick)
            if (dim) opacity.value = withTiming(0.75, { duration: Motion.instant })
            onPressIn?.(event)
         }}
         onPressOut={event => {
            scale.value = withSpring(1, Motion.springQuick)
            if (dim) opacity.value = withTiming(1, { duration: Motion.fast })
            onPressOut?.(event)
         }}
         {...rest}
      >
         {children}
      </AnimatedPressable>
   )
}
