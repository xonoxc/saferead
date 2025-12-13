import { Tabs } from "expo-router"
import { Home, Settings, Box, FileUp } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { getTabBarStyles } from "@/utils/helpers/tabs"
import { useTabStore } from "@/store/tab"
import ScanBtn from "@/components/ScanBtn"

export default function TabLayout() {
   const { colors } = useTheme()
   const tabVisible = useTabStore(s => s.tabVisible)

   return (
      <Tabs
         screenOptions={{
            animation: "shift",
            headerShown: false,
            tabBarActiveTintColor: colors.text,
            tabBarShowLabel: false,
            sceneStyle: { flex: 1, backgroundColor: colors.background },
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
               ...getTabBarStyles(colors),
               display: tabVisible ? "flex" : "none",
            },
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "Home",
               tabBarIcon: props => <Home {...props} />,
            }}
         />

         <Tabs.Screen
            name="analyize"
            options={{
               title: "Analyze",
               tabBarIcon: props => <FileUp {...props} />,
            }}
         />

         {/* central scan btn */}
         <Tabs.Screen
            name="scan"
            options={{
               tabBarButton: ({ style }) => <ScanBtn style={style} />,
            }}
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
               tabBarIcon: props => <Box {...props} />,
            }}
         />

         {/*this is premium screen but only conditionally visible so we dont*/}
         {/*so we don't want it to be visible in the tabs */}
         <Tabs.Screen
            name="premium"
            options={{
               href: null,
            }}
         />
         <Tabs.Screen
            name="settings"
            options={{
               title: "Settings",
               tabBarIcon: props => <Settings {...props} />,
            }}
         />
      </Tabs>
   )
}
