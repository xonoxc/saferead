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
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { KeyboardProvider } from "react-native-keyboard-controller"

import { ErrorBoundary } from "@/components/ErrorBoundry"
import { DrawerAlertRenderer } from "@/hooks/alerts/useAlert"
import useNetworkStatus from "@/hooks/net/useNetworkStatus"
import { OfflineScreen } from "@/components/OfflineScreen"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useLocaleStore } from "@/store/useLocaleStore"
import { useOrgStore } from "@/store/useOrgStore"

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
   const [isAppLoading, setIsAppLoading] = useState(true)
   const isOffline = useNetworkStatus()

   /*
    * Read the saved currency/language before anything renders prices or copy,
    * so a user who chose ₹ never sees a frame of $ first.
    * **/
   const hydrateLocale = useLocaleStore(s => s.hydrate)
   const isLocaleHydrated = useLocaleStore(s => s.isHydrated)

   useEffect(() => {
      hydrateLocale()
   }, [hydrateLocale])

   /*
    * Read the saved workspace before any contracts request goes out — the
    * axios interceptor turns it into the `X-Org` header, and a request made
    * before hydration finishes would be answered for the wrong workspace.
    * **/
   const hydrateOrg = useOrgStore(s => s.hydrate)

   useEffect(() => {
      hydrateOrg()
   }, [hydrateOrg])

   useEffect(() => {
      if (!fontsLoaded) return

      if (!isThemeLoading) {
         setTimeout(() => {
            setIsAppLoading(false)
            SplashScreen.hideAsync().catch(console.warn)
         })
      }
   }, [isThemeLoading, fontsLoaded])

   if (isAppLoading || isThemeLoading || !isLocaleHydrated) return null

   if (isOffline) {
      return <OfflineScreen />
   }

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
         {/*
          * Android is always edge-to-edge from SDK 54 on, so the status bar is
          * permanently translucent and `backgroundColor` no longer exists.
          * **/}
         <StatusBar style={isDark ? "light" : "dark"} />
      </KeyboardProvider>
   )
}

export default function RootLayout() {
   return (
      <SafeAreaProvider style={{ flex: 1 }} initialMetrics={initialWindowMetrics}>
         <ThemeProvider>
            <AuthProvider>
               <ErrorBoundary>
                  <DrawerAlertRenderer>
                     <GestureHandlerRootView>
                        <AppContent />
                     </GestureHandlerRootView>
                  </DrawerAlertRenderer>
               </ErrorBoundary>
            </AuthProvider>
         </ThemeProvider>
      </SafeAreaProvider>
   )
}
