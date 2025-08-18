import { useTheme } from "@/hooks/useTheme"
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Redirect, Stack } from "expo-router"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { CustomBackBtn } from "@/components"
import { useAuth } from "@/hooks/useAuth"

export default function ApplicationLayout() {
  const { colors } = useTheme()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          /*
           * this is a global handler that invalidates the queries after a successful mutation
           * just add
           * ***meta: { invalidates: [["queryKey"]] }***
           * to the mutation options
           */
          onSuccess: async (_data, _variables, _context, mutation) => {
            const invalidates = mutation.meta?.invalidateQueries
            if (invalidates && Array.isArray(invalidates)) {
              await Promise.all(
                invalidates.map(queryKey => queryClient.invalidateQueries(queryKey))
              )
            }
          },
        }),
      })
  )

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
