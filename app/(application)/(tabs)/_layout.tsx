import { Redirect, Tabs } from "expo-router"
import { Home, Settings, TextSearch, Box } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { getTabBarStyles } from "@/utils/helpers/tabs"

export default function TabLayout() {
  const { colors } = useTheme()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />
  }

  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        sceneStyle: { backgroundColor: colors.background },
        headerShown: false,
        tabBarActiveTintColor: "pink",
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: getTabBarStyles(colors),
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
        name="analyize"
        options={{
          title: "Analyze",
          tabBarIcon: ({ size, color }) => <TextSearch size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="spaces"
        options={{
          title: "Spaces",
          tabBarIcon: ({ size, color }) => <Box size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="premium"
        options={{
          href: null,
          /* title: "Premium",
          tabBarIcon: ({ size, color }) => <CreditCard size={size} color={color} />, */
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
