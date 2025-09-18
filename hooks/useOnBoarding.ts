import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { attempt } from "@/utils/attempt"

const ONBOARDING_KEY = "has_completed_onboarding"

export function useOnboarding() {
   const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      checkOnboardingStatus()
   }, [])

   const checkOnboardingStatus = async () => {
      const result = await attempt(AsyncStorage.getItem(ONBOARDING_KEY))

      if (!result.ok) {
         console.error("Error checking onboarding status:", result.error)
         setHasCompletedOnboarding(false)
      } else {
         setHasCompletedOnboarding(result.data === "true")
      }

      setIsLoading(false)
   }

   const completeOnboarding = async () => {
      const result = await attempt(AsyncStorage.setItem(ONBOARDING_KEY, "true"))
      if (!result.ok) {
         console.error("Error completing onboarding:", result.error)
         return
      }
      setHasCompletedOnboarding(true)
   }

   const resetOnboarding = async () => {
      const result = await attempt(AsyncStorage.removeItem(ONBOARDING_KEY))
      if (!result.ok) {
         console.error("Error resetting onboarding:", result.error)
         return
      }
      setHasCompletedOnboarding(false)
   }

   const skipOnboarding = async () => {
      await completeOnboarding()
   }

   return {
      hasCompletedOnboarding,
      isLoading,
      completeOnboarding,
      resetOnboarding,
      skipOnboarding,
   }
}
