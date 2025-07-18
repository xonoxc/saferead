import CustomBackBtn from "@/components/CustomBackBtn"
import { useTheme } from "@/hooks/useTheme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

const queryClient = new QueryClient()

export default function ApplicationLayout() {
  const { colors } = useTheme()

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="change-password"
            options={{
              headerTitle: "Change Password",
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
        </Stack>
      </SafeAreaView>
    </QueryClientProvider>
  )
}
