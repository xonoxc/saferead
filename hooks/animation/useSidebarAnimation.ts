import React from "react"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { Motion } from "@/constants/Design"

export function useLayoutSlideAnimation(isSideOpen: boolean, SCREEN_WIDTH: number) {
   const translateX = useSharedValue(-SCREEN_WIDTH)

   React.useEffect(() => {
      /*
       * Uses the shared spring so the panel settles without overshooting.
       * Overshoot is most obvious on a full-width surface: the sidebar slid
       * past its edge and rebounded, which looked like a glitch rather than
       * a flourish.
       */
      translateX.value = withSpring(isSideOpen ? 0 : -SCREEN_WIDTH, Motion.spring)
   }, [isSideOpen, translateX])

   const sideStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
   }))
   const mainContentStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value + SCREEN_WIDTH }],
   }))

   return {
      sideStyle,
      mainContentStyle,
   }
}
