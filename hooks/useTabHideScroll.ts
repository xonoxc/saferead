import React from "react"

import { useTabStore } from "@/store/tab"

import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

/* Ignore sub-pixel jitter, and require a deliberate drag before reacting. */
const DIRECTION_THRESHOLD = 6
/* Never hide the bar while the user is still near the top of the list. */
const TOP_GRACE = 24

/*
 * Hide the tab bar while scrolling down, bring it back on the way up.
 *
 * This used to call `navigation.getParent()?.setOptions({ tabBarStyle })`. From
 * a tab screen the parent is the surrounding stack, which has no tab bar to
 * configure, so the whole gesture did nothing. Driving the shared store instead
 * hits the same flag the bar already animates on.
 * **/
export function useTabHideScroll() {
   const setTabBarVisibility = useTabStore(s => s.setTabBarVisibility)
   const lastOffset = React.useRef<number>(0)

   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y
      const diff = currentOffset - lastOffset.current

      if (Math.abs(diff) < DIRECTION_THRESHOLD) return

      lastOffset.current = currentOffset

      if (currentOffset <= TOP_GRACE) {
         setTabBarVisibility(true)
         return
      }

      setTabBarVisibility(diff < 0)
   }

   /* Leaving a screen mid-scroll must not strand the bar off-screen. */
   React.useEffect(() => {
      return () => setTabBarVisibility(true)
   }, [setTabBarVisibility])

   return {
      handleScroll,
   }
}
