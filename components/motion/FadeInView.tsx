import React from "react"
import Animated, {
   Easing,
   FadeInDown,
   FadeIn,
   type AnimatedStyle,
} from "react-native-reanimated"
import { type StyleProp, type ViewStyle } from "react-native"

import { Motion } from "@/constants/Design"
import { isWeb } from "@/utils/helpers/platform"

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

   /*
    * No entrance animation on web, and this is a correctness fix rather than a
    * taste one.
    *
    * Reanimated's entering animations set the element to `opacity: 0` up front
    * and rely on the animation driver to bring it back. On web that driver
    * does not reliably start for a screen mounted during a hard page load —
    * the element is left at `opacity: 0, translateY: 25` permanently, and the
    * content is simply never visible. It reproduces on the home screen: the
    * DOM is fully populated and the page renders blank.
    *
    * A failed animation has to degrade to *no animation*, never to *no
    * content*. Native is unaffected and keeps the staggered entrance.
    * **/
   if (isWeb()) {
      return <Animated.View style={style}>{children}</Animated.View>
   }

   return (
      <Animated.View entering={entering} style={style}>
         {children}
      </Animated.View>
   )
}
