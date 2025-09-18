import React from "react"
import { Dimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
   useAnimatedStyle,
   withTiming,
   runOnJS,
   withSpring,
   type SharedValue,
} from "react-native-reanimated"

const { width: screenWidth } = Dimensions.get("window")
const swipeThreshold = screenWidth * 0.2

interface OnboardingGestureProps {
   children: React.ReactNode
   currentStep: number
   totalSteps: number
   onNext: () => void
   onPrevious: () => void
   translateX: SharedValue<number>
}

export const OnboardingGesture: React.FC<OnboardingGestureProps> = ({
   children,
   currentStep,
   totalSteps,
   onNext,
   onPrevious,
   translateX,
}) => {
   const pan = Gesture.Pan()
      .onUpdate(event => {
         translateX.value = event.translationX
      })
      .onEnd(event => {
         const shouldGoNext = event.translationX < -swipeThreshold && currentStep < totalSteps - 1
         const shouldGoPrev = event.translationX > swipeThreshold && currentStep > 0

         if (shouldGoNext) {
            onNext()
            translateX.value = withTiming(0, { duration: 300 })
         } else if (shouldGoPrev) {
            onPrevious()
            translateX.value = withTiming(0, { duration: 300 })
         } else {
            translateX.value = withSpring(0)
         }
      })

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
   }))

   return (
      <GestureDetector gesture={pan}>
         <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
   )
}
