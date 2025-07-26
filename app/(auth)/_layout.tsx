import { Stack, Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/hooks/useTheme"

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  const { colors } = useTheme()

  if (isAuthenticated) {
    return <Redirect href="/(application)/(tabs)" />
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
