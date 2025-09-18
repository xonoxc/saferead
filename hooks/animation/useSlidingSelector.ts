import { useEffect } from "react"
import { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated"

type SlidingSelectorOptions = {
   index: number
   widthPerItem: number | ((index: number) => number)
   duration?: number
   borderRadius?: number
   onAnimationEnd?: () => void
   easing?: (value: number) => number
}

export function useSlidingSelector({
   index,
   widthPerItem,
   duration = 200,
   borderRadius = 20,
   onAnimationEnd,
   easing = Easing.out(Easing.exp),
}: SlidingSelectorOptions) {
   const translateX = useSharedValue(
      typeof widthPerItem === "function" ? widthPerItem(index) : index * widthPerItem
   )

   useEffect(() => {
      const nextX = typeof widthPerItem === "function" ? widthPerItem(index) : index * widthPerItem

      translateX.value = withTiming(
         nextX,
         {
            duration,
            easing,
         },
         finished => {
            if (finished && onAnimationEnd) onAnimationEnd()
         }
      )
   }, [index, widthPerItem])

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
      borderRadius,
   }))

   return animatedStyle
}
