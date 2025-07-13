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
import { useFrameworkReady } from "@/hooks/useFrameworkReady"
import * as SplashScreen from "expo-splash-screen"
import * as SystemUI from "expo-system-ui"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"

SplashScreen.preventAutoHideAsync()

const AppContent = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "RobotoMono-Regular": RobotoMono_400Regular,
  })

  const { colors, isDark } = useTheme()
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    if (!fontsLoaded) return

    if (fontsLoaded) {
      setAppReady(true)
    }
  }, [fontsLoaded])

  const onLayout = async () => {
    if (appReady) {
      await SystemUI.setBackgroundColorAsync("#000000")
      await SplashScreen.hideAsync()
    }
  }

  if (!appReady) return null

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(application)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={isDark ? "light" : "dark"} />
      </AuthProvider>
    </View>
  )
}

export default function RootLayout() {
  useFrameworkReady()

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
