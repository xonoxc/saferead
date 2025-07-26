import { Tabs } from "expo-router"
import { Home, Settings, Box, ScanSearch } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { getTabBarStyles } from "@/utils/helpers/tabs"

export default function TabLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarShowLabel: false,
        sceneStyle: { flex: 1, backgroundColor: colors.background },
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
          tabBarIcon: ({ size, color }) => <ScanSearch size={size} color={color} />,
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
