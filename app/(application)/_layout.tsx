import { useTheme } from "@/hooks/useTheme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { CustomBackBtn } from "@/components"

export default function ApplicationLayout() {
  const { colors } = useTheme()
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="change-password"
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
