import { Tabs } from "expo-router"
import { Home, Settings, Box, FileSignature } from "lucide-react-native"

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
            name="contracts"
            options={{
               title: "Contracts",
               tabBarIcon: ({ color, size }) => (
                  <FileSignature color={color} size={size} strokeWidth={2} />
               ),
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
            name="spaces"
            options={{
               title: "Spaces",
               tabBarIcon: ({ color, size }) => <Box color={color} size={size} strokeWidth={2} />,
            }}
         />

         {/*
          * Reachable by route, deliberately absent from the bar.
          *
          * `analyize` is the scan history. It lost its tab slot to Contracts
          * when the product's centre of gravity moved from one-off scans to the
          * portfolio - five tabs plus a raised centre action is already one too
          * many, and scan history is now reached from the home screen's recent
          * activity, which is where people look for it anyway.
          * **/}
         <Tabs.Screen name="analyize" options={{ href: null }} />
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
