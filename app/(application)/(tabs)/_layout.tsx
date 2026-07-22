import { Tabs } from "expo-router"
import { Home, Settings, Box, Clock } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { BottomTabBar } from "@/components/tabs/BottomTabBar"

/*
 * Icons are declared once here and rendered by the custom bar, so the bar stays
 * a presentation concern and this file stays the single place that says which
 * screens exist and what they are called.
 * **/
export default function TabLayout() {
   const { colors } = useTheme()

   return (
      <Tabs
         tabBar={props => <BottomTabBar {...props} />}
         screenOptions={{
            animation: "shift",
            headerShown: false,
            sceneStyle: { flex: 1, backgroundColor: colors.background },
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "Home",
               tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} />,
            }}
         />

         <Tabs.Screen
            name="spaces"
            options={{
               title: "Spaces",
               tabBarIcon: ({ color, size }) => <Box color={color} size={size} strokeWidth={2} />,
            }}
         />

         {/* Rendered by the bar as the raised centre action, not as a tab. */}
         <Tabs.Screen
            name="scan"
            options={{ title: "Scan" }}
            listeners={{
               tabPress: e => {
                  e.preventDefault()
               },
            }}
         />

         <Tabs.Screen
            name="analyize"
            options={{
               title: "Analyze",
               tabBarIcon: ({ color, size }) => <Clock color={color} size={size} strokeWidth={2} />,
            }}
         />

         {/* Reachable by route, but deliberately absent from the bar. */}
         <Tabs.Screen name="premium" options={{ href: null }} />

         <Tabs.Screen
            name="settings"
            options={{
               title: "Settings",
               tabBarIcon: ({ color, size }) => (
                  <Settings color={color} size={size} strokeWidth={2} />
               ),
            }}
         />
      </Tabs>
   )
}
