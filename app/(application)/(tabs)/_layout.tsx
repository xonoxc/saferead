import { Redirect, Tabs } from "expo-router"
import { Home, FileText, Settings, CreditCard } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { Platform } from "react-native"
import { useAuth } from "@/hooks/useAuth"

export default function TabLayout() {
  const { colors } = useTheme()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "pink",
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {
            position: "absolute",
            flex: 1,
            bottom: 0,
            paddingTop: 16,
            alignItems: "center",
            height: 70,
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            borderTopWidth: 0,
            shadowColor: colors.textMuted,
            zIndex: 1000,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: "Documents",
          tabBarIcon: ({ size, color }) => <FileText size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="premium"
        options={{
          title: "Premium",
          tabBarIcon: ({ size, color }) => <CreditCard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
