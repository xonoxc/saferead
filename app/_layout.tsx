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
import { ThemeProvider, useTheme } from "@/hooks/useTheme"
import * as SplashScreen from "expo-splash-screen"
import React, { useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { KeyboardProvider } from "react-native-keyboard-controller"

import { ErrorBoundary } from "@/components/ErrorBoundry"
import { DrawerAlertRenderer } from "@/hooks/alerts/useAlert"

SplashScreen.preventAutoHideAsync()

const AppContent = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "RobotoMono-Regular": RobotoMono_400Regular,
  })

  const { colors, isDark, isThemeLoading } = useTheme()
  const colorScheme = useColorScheme()
  const [isAppLoading, setIsAppLoading] = useState(true)

  console.log("colorscheme", colorScheme)

  useEffect(() => {
    if (!fontsLoaded) return

    if (!isThemeLoading) {
      setTimeout(() => {
        setIsAppLoading(false)
        SplashScreen.hideAsync().catch(console.warn)
      })
    }
  }, [isThemeLoading, fontsLoaded])

  if (isAppLoading || isThemeLoading) return null

  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1, backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(application)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </KeyboardProvider>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider
      style={{ flex: 1, backgroundColor: "black" }}
      initialMetrics={initialWindowMetrics}
    >
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <DrawerAlertRenderer>
              <AppContent />
            </DrawerAlertRenderer>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
