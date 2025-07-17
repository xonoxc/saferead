import { Redirect, Tabs } from "expo-router"
import { Home, FileText, Settings, TextSearch, Box } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { getTabBarStyles } from "@/utils/helpers/tabs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function TabLayout() {
  const { colors } = useTheme()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
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
    </QueryClientProvider>
  )
}
