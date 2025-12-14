import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "expo-router"
import { useQueryClient } from "@tanstack/react-query"
import SettingsGroup from "@/components/settings/SettingsGroup"
import useSettingsGroups from "@/hooks/screens/useSettingsGroup"
import SettingsThemeDropdown from "@/components/settings/SettingsThemeDropDown"
import { Fonts, FontSizes } from "@/constants"
import { UpgradeButton } from "@/components"
import { Sparkle } from "lucide-react-native"

export default function SettingsScreen() {
   const { colors, mode, setTheme } = useTheme()
   const { user, logout } = useAuth()
   const router = useRouter()
   const queryClient = useQueryClient()

   const handleLogout = async () => {
      queryClient.clear()
      await logout()
   }

   const groups = useSettingsGroups({ user, mode, setTheme, router, handleLogout })

   return (
      <ScrollView
         style={[styles.container, { backgroundColor: colors.background }]}
         contentContainerStyle={{ paddingBottom: 120 }}
         showsVerticalScrollIndicator={false}
      >
         <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
         </View>

         <View style={{ paddingHorizontal: 2, margin: 20 }}>
            <UpgradeCard />
         </View>

         <View style={styles.content}>
            <SettingsThemeDropdown />
            {groups.map((group, i) => (
               <SettingsGroup key={i} group={group} />
            ))}
         </View>

         <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>SafeRead v1.0.0</Text>
         </View>
      </ScrollView>
   )
}

function UpgradeCard() {
   return (
      <UpgradeButton
         btnStyles={{
            borderRadius: 12,
         }}
         renderContent={() => {
            return (
               <View
                  style={{
                     alignItems: "flex-start",
                     height: 100,
                     justifyContent: "center",
                  }}
               >
                  <View>
                     <Sparkle color="white" size={19} />
                     <Text
                        style={{
                           fontFamily: Fonts.bold,
                           fontSize: FontSizes.sm,
                           color: "white",
                        }}
                     >
                        Upgrade to Pro
                     </Text>
                  </View>

                  <Text
                     style={{
                        fontFamily: Fonts.regular,
                        fontSize: FontSizes.xs,
                        color: "rgba(255,255,255,0.85)",
                        marginTop: 2,
                     }}
                  >
                     Get unlimited analysis, deeper insights, and priority processing
                  </Text>
               </View>
            )
         }}
      />
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      padding: 20,
      paddingBottom: 0,
   },
   title: {
      fontSize: FontSizes.xxxl,
      fontFamily: Fonts.bold,
   },
   content: {
      flex: 1,
      padding: 20,
   },
   footer: {
      padding: 20,
      alignItems: "center",
   },
   footerText: {
      fontSize: FontSizes.sm,
      fontFamily: Fonts.regular,
   },
})
