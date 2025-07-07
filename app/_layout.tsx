import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter"
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono"
import { AuthProvider } from "@/hooks/useAuth"
import { ThemeProvider } from "@/hooks/useTheme"
import { useFrameworkReady } from "@/hooks/useFrameworkReady"
import { LoadingSpinner } from "@/components/LoadingSpinner"

function AppContent() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "RobotoMono-Regular": RobotoMono_400Regular,
  })

  if (!fontsLoaded) {
    return <LoadingSpinner />
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  )
}

export default function RootLayout() {
  useFrameworkReady()

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
