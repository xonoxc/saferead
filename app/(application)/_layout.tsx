import CustomBackBtn from "@/components/CustomBackBtn"
import { useTheme } from "@/hooks/useTheme"
import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ApplicationLayout() {
  const { colors } = useTheme()

  return (
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
  )
}
