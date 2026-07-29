import { Tabs } from "expo-router"
import { Home, Box, FileSignature, MessagesSquare } from "lucide-react-native"

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
          * Chat has its own slot rather than living inside the scan-history
          * screen. It was previously a *mode* of that tab: reachable only by
          * selecting a space elsewhere, invisible in the bar, and it hid the
          * tab bar while active so the only way out was a bespoke exit button.
          * **/}
         <Tabs.Screen
            name="chat"
            options={{
               title: "Chat",
               tabBarIcon: ({ color, size }) => (
                  <MessagesSquare color={color} size={size} strokeWidth={2} />
               ),
            }}
         />

         {/*
          * Reachable by route, deliberately absent from the bar.
          *
          * `analyize` is the scan history. It lost its tab slot to Contracts
          * when the product's centre of gravity moved from one-off scans to the
          * portfolio, and is now reached from the home screen's recent
          * activity, which is where people look for it anyway.
          *
          * `settings` was lifted out when Chat took a slot: four labelled tabs
          * plus the raised scan action is the most this bar fits before every
          * label truncates, and settings is a place you visit and leave rather
          * than one of the four you work in. It is a gear on the home header
          * now — see `Greeting` in index.tsx.
          * **/}
         <Tabs.Screen name="analyize" options={{ href: null }} />
         <Tabs.Screen name="premium" options={{ href: null }} />
         <Tabs.Screen name="settings" options={{ href: null }} />
      </Tabs>
   )
}
