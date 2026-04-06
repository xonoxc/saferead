import {
   interpolate,
   useAnimatedScrollHandler,
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from "react-native-reanimated"

export function useHideOnScroll() {
   const prevScrollY = useSharedValue(0)
   const isSubjectVisible = useSharedValue(1)

   const animatedStyle = useAnimatedStyle(() => {
      const opacity = withTiming(isSubjectVisible.value, { duration: 200 })
      const translateY = withTiming(interpolate(isSubjectVisible.value, [0, 1], [50, 0], "clamp"), {
         duration: 200,
      })

      return {
         opacity,
         transform: [{ translateY }],
      }
   }, [])

   const handleDocumentListScroll = useAnimatedScrollHandler({
      onScroll: event => {
         const currentY = event.contentOffset.y
         const deltaY = currentY - prevScrollY.value

         if (deltaY > 5) {
            isSubjectVisible.value = withTiming(0, { duration: 200 })
         } else if (deltaY < -5) {
            isSubjectVisible.value = withTiming(1, { duration: 200 })
         }
         prevScrollY.value = currentY
      },
   })

   return {
      animatedStyle,
      handleDocumentListScroll,
      isSubjectVisible,
   }
}
