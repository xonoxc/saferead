import { useTheme } from "@/hooks/useTheme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Redirect, Stack } from "expo-router"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { CustomBackBtn } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { createApplicationMutationCache } from "@/config/mutationCache"

export default function ApplicationLayout() {
  const { colors } = useTheme()
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
