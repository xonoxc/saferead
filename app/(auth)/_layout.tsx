import { Stack, Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  /*
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />
  }
*/
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  )
}
