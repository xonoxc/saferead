import React from "react"
import { StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"

interface OnboardingPaginatorProps {
  steps: any[]
  currentStep: number
}

export const OnboardingPaginator: React.FC<OnboardingPaginatorProps> = ({ steps, currentStep }) => {
  const { colors } = useTheme()

  return (
    <Animated.View style={styles.progressContainer}>
      {steps.map((_, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            backgroundColor: withTiming(index <= currentStep ? colors.primary : colors.border, {
              duration: 300,
            }),
            width: withTiming(index === currentStep ? 24 : 8, { duration: 300 }),
          }
        })
        return <Animated.View key={index} style={[styles.progressDot, animatedStyle]} />
      })}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    gap: 8,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
})
