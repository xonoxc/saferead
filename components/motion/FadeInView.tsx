import React from "react"
import Animated, {
   Easing,
   FadeInDown,
   FadeIn,
   type AnimatedStyle,
} from "react-native-reanimated"
import { type StyleProp, type ViewStyle } from "react-native"

import { Motion } from "@/constants/Design"

interface FadeInViewProps {
   children: React.ReactNode
   /* Position in a list. Drives the stagger delay. */
   index?: number
   /* Extra delay on top of the stagger, in ms. */
   delay?: number
   duration?: number
   /* Rise from below as it fades in. Disable for elements already in motion. */
   rise?: boolean
   style?: StyleProp<ViewStyle | AnimatedStyle<ViewStyle>>
}

/*
 * Fades content in, optionally rising from below and offset by list position.
 *
 * Capping the stagger matters: without it a long list makes the last rows wait
 * seconds before appearing, which reads as jank rather than polish.
 * **/
const MAX_STAGGER_STEPS = 8

export function FadeInView({
   children,
   index = 0,
   delay = 0,
   duration = Motion.base,
   rise = true,
   style,
}: FadeInViewProps) {
   const staggerSteps = Math.min(index, MAX_STAGGER_STEPS)
   const totalDelay = delay + staggerSteps * Motion.stagger

   /*
    * Deliberately eased rather than sprung. `.springify()` overshoots its
    * resting position and settles back, and with a staggered list every row
    * did that in sequence - the effect read as the screen wobbling into place.
    * A decelerating curve arrives once and stops, which is what makes the
    * entrance feel composed instead of bouncy.
    *
    * The initial offset is set explicitly because FadeInDown otherwise travels
    * a fixed 25px, ignoring the riseDistance token.
    */
   const entering = rise
      ? FadeInDown.duration(duration)
           .delay(totalDelay)
           .easing(Easing.out(Easing.cubic))
           .withInitialValues({ transform: [{ translateY: Motion.riseDistance }] })
      : FadeIn.duration(duration).delay(totalDelay)

   return (
      <Animated.View entering={entering} style={style}>
         {children}
      </Animated.View>
   )
}
