import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated"
import { ArrowLeft } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/Button"

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

interface OnboardingNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
}) => {
  const { colors } = useTheme()

  return (
    <Animated.View style={styles.navigationContainer}>
      <View style={styles.navigationButtons}>
        {currentStep > 0 && (
          <AnimatedTouchableOpacity
            entering={SlideInRight.springify()}
            exiting={SlideOutLeft.springify()}
            style={[
              styles.navButton,
              styles.backButton,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={onPrevious}
          >
            <ArrowLeft size={20} color={colors.textSecondary} />
          </AnimatedTouchableOpacity>
        )}

        <View style={styles.nextButtonContainer}>
          <Button
            title={currentStep === totalSteps - 1 ? "Get Started" : "Continue"}
            onPress={onNext}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  navigationContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButtonContainer: {
    flex: 1,
  },
})
