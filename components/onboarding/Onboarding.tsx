import React, { useState, useCallback, useMemo } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, {
   FadeInDown,
   useSharedValue,
   useAnimatedStyle,
   withTiming,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Shield, Brain, Users, Sparkles, CheckCircle } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { OnboardingScreen } from "./OnboardingScreen"
import { OnboardingPaginator } from "./OnboardingPaginator"
import { OnboardingNavigation } from "./OnboardingNavigation"
import { OnboardingGesture } from "./OnboardingGesture"
import { WelcomeDemo, AnalysisDemo, RiskDemo, SpacesDemo, CompletionDemo } from "./demos"

const { height: screenHeight } = Dimensions.get("window")

const steps = [
   {
      id: 1,
      title: "Welcome to SafeRead",
      subtitle: "Your AI-Powered Companion",
      description:
         "Transform complex legal documents into clear, actionable insights with the power of artificial intelligence.",
      icon: Sparkles,
      gradient: ["#6366F1", "#8B5CF6"],
      demo: <WelcomeDemo />,
   },
   {
      id: 2,
      title: "Instant Document Analysis",
      subtitle: "Upload, Scan, or Paste",
      description:
         "Get comprehensive legal analysis in seconds. Our AI identifies risks, key terms, and provides actionable recommendations.",
      icon: Brain,
      gradient: ["#06B6D4", "#3B82F6"],
      interactive: <AnalysisDemo />,
   },
   {
      id: 3,
      title: "Smart Risk Assessment",
      subtitle: "Know Before You Sign",
      description:
         "Advanced AI evaluates contract terms, highlights potential issues, and suggests protective measures for your interests.",
      icon: Shield,
      gradient: ["#10B981", "#059669"],
      demo: <RiskDemo />,
   },
   {
      id: 4,
      title: "Organize with Spaces",
      subtitle: "Keep Everything Structured",
      description:
         "Create dedicated spaces for different projects, clients, or document types. Stay organized and find what you need instantly.",
      icon: Users,
      gradient: ["#F59E0B", "#D97706"],
      interactive: <SpacesDemo />,
   },
   {
      id: 5,
      title: "You're All Set!",
      subtitle: "Start Analyzing Documents",
      description:
         "Join thousands of professionals who trust Assist to navigate complex legal documents with confidence.",
      icon: CheckCircle,
      gradient: ["#EF4444", "#DC2626"],
      demo: <CompletionDemo />,
   },
]

interface OnboardingProps {
   onComplete: () => void
   onSkip: () => void
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
   const { colors } = useTheme()
   const [currentStep, setCurrentStep] = useState(0)
   const translateX = useSharedValue(0)

   const currentStepData = useMemo(() => steps[currentStep], [currentStep])

   const handleNext = useCallback(() => {
      if (currentStep < steps.length - 1) {
         setCurrentStep(currentStep + 1)
         translateX.value = 0
      } else {
         onComplete()
      }
   }, [currentStep, onComplete, translateX])

   const handlePrevious = useCallback(() => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1)
         translateX.value = 0
      }
   }, [currentStep, translateX])

   const animatedGradientStyle = useAnimatedStyle(() => {
      return {
         backgroundColor: withTiming(currentStepData.gradient[0], { duration: 300 }),
      }
   })

   return (
      <GestureHandlerRootView>
         <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View style={[styles.backgroundGradient, animatedGradientStyle]}>
               <LinearGradient
                  colors={[
                     currentStepData.gradient[0] + "20",
                     currentStepData.gradient[1] + "10",
                     "transparent",
                  ]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
               />
            </Animated.View>

            <Animated.View
               entering={FadeInDown.delay(200).springify()}
               style={styles.skipContainer}
            >
               <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                  <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
               </TouchableOpacity>
            </Animated.View>

            <View style={styles.paginatorContainer}>
               <OnboardingPaginator steps={steps} currentStep={currentStep} />
            </View>

            <View style={styles.content}>
               <OnboardingGesture
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  translateX={translateX}
               >
                  <OnboardingScreen item={currentStepData} />
               </OnboardingGesture>
            </View>

            <OnboardingNavigation
               currentStep={currentStep}
               totalSteps={steps.length}
               onNext={handleNext}
               onPrevious={handlePrevious}
            />
         </View>
      </GestureHandlerRootView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      position: "relative",
   },
   backgroundGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: screenHeight * 0.6,
   },
   skipContainer: {
      position: "absolute",
      top: 60,
      right: 20,
      zIndex: 10,
   },
   skipButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   skipText: {
      fontSize: FontSizes.md,
      fontFamily: Fonts.medium,
   },
   paginatorContainer: {
      paddingTop: 100,
   },
   content: {
      flex: 1,
   },
})
