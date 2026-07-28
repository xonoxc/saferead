import { useTheme } from "@/hooks/useTheme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Redirect, Stack } from "expo-router"
import { useState } from "react"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { CustomBackBtn } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { createApplicationMutationCache } from "@/config/mutationCache"

export default function ApplicationLayout() {
   const { colors } = useTheme()
   const insets = useSafeAreaInsets()

   /*
    * Global queryCLient instance for the application
    * **/
   const [queryClient] = useState(() => {
      let qc: QueryClient
      qc = new QueryClient({
         /*
          * double closure injection to ensure the queryClient is available
          * **/
         mutationCache: createApplicationMutationCache(() => qc),
      })
      return qc
   })

   const { isAuthenticated } = useAuth()

   if (!isAuthenticated) {
      return <Redirect href="/(auth)/welcome" />
   }

   return (
      <QueryClientProvider client={queryClient}>
         {/*
          * SafeAreaView applies its edges additively, so the explicit
          * paddingBottom below was being stacked on top of the bottom inset -
          * on a device with a home indicator that is roughly 68pt of dead space
          * under the tab bar. Turning the bottom edge off leaves exactly the
          * one gap this padding intends.
          * **/}
         <SafeAreaView
            edges={{ top: "additive", left: "additive", right: "additive", bottom: "off" }}
            style={{
               flex: 1,
               backgroundColor: colors.background,
               paddingBottom: Math.max(insets.bottom, 16),
            }}
         >
            <Stack>
               <Stack.Screen
                  name="(tabs)"
                  options={{
                     headerShown: false,
                     contentStyle: {
                        backgroundColor: colors.background,
                     },
                  }}
               />
               <Stack.Screen
                  name="change_password"
                  options={{
                     headerTitle: "",
                     headerTitleStyle: {
                        color: colors.text,
                        fontFamily: "Inter-Medium",
                        fontSize: 15,
                     },
                     headerTitleAlign: "center",
                     headerStyle: {
                        backgroundColor: colors.background,
                     },
                     headerLeft: () => <CustomBackBtn />,
                  }}
               />

               <Stack.Screen
                  name="analysisres"
                  options={{
                     headerShown: false,
                  }}
               />

               <Stack.Screen
                  name="scan_menu_screen"
                  options={{
                     headerShown: false,
                  }}
               />

               <Stack.Screen
                  name="spaces/[id]"
                  options={{
                     headerShown: false,
                  }}
               />

               <Stack.Screen
                  name="contracts/[id]"
                  options={{
                     headerShown: false,
                  }}
               />

               <Stack.Screen
                  name="contracts/new"
                  options={{
                     headerShown: false,
                  }}
               />

               <Stack.Screen
                  name="help"
                  options={{
                     headerShown: false,
                  }}
               />

               <Stack.Screen
                  name="profile"
                  options={{
                     headerShown: false,
                  }}
               />
               <Stack.Screen
                  name="privacy"
                  options={{
                     headerShown: false,
                  }}
               />

               <Stack.Screen
                  name="language"
                  options={{
                     headerShown: false,
                  }}
               />
            </Stack>
         </SafeAreaView>
      </QueryClientProvider>
   )
}
