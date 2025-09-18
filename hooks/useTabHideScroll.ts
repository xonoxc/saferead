import { useNavigation } from "expo-router"
import React from "react"

import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

export function useTabHideScroll() {
   const navigation = useNavigation()
   const lastOffset = React.useRef<number>(0)

   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y
      const diff = currentOffset - lastOffset.current

      if (Math.abs(diff) < 3) return

      if (diff > 0) {
         navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } })
      } else {
         navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } })
      }
      lastOffset.current = currentOffset
   }

   return {
      handleScroll,
   }
}
