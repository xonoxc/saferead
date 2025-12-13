import { Stack, Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/hooks/useTheme"
import { useOnboarding } from "@/hooks/useOnBoarding"
import { Onboarding } from "@/components"
import { LoadingSpinner } from "@/components"

export default function AuthLayout() {
   const { isAuthenticated } = useAuth()
   const { colors } = useTheme()
   const { hasCompletedOnboarding, isLoading, completeOnboarding, skipOnboarding } = useOnboarding()

   switch (true) {
      case isAuthenticated:
         return <Redirect href="/(application)/(tabs)" />
      case !isAuthenticated && !hasCompletedOnboarding:
         return <Onboarding onComplete={completeOnboarding} onSkip={skipOnboarding} />
      case isLoading:
         return <LoadingSpinner />
   }

   return (
      <Stack
         screenOptions={{
            headerShown: false,
            contentStyle: {
               backgroundColor: colors.background,
            },
         }}
      >
         <Stack.Screen name="welcome" />
         <Stack.Screen name="login" />
         <Stack.Screen name="register" />
      </Stack>
   )
}
