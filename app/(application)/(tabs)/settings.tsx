import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "expo-router"
import { useQueryClient } from "@tanstack/react-query"
import SettingsGroup from "@/components/settings/SettingsGroup"
import useSettingsGroups from "@/hooks/screens/useSettingsGroup"
import SettingsThemeDropdown from "@/components/settings/SettingsThemeDropDown"
import { Fonts, FontSizes, Spacing } from "@/constants"
import { TAB_BAR_CLEARANCE } from "@/constants/Design"
import { CustomBackBtn } from "@/components"
import { UpgradeCard } from "@/components/plans/UpgradeCard"

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
         contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
         showsVerticalScrollIndicator={false}
      >
         {/*
          * Settings is no longer a tab, so it needs its own way back. Reached
          * from the gear on Home — see the tab layout for why it moved.
          * **/}
         <View style={styles.header}>
            <CustomBackBtn onPress={() => router.back()} />
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
         </View>

         <View style={styles.upgrade}>
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

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      padding: 20,
      paddingBottom: 0,
      gap: Spacing.sm,
      alignItems: "flex-start",
   },
   upgrade: {
      paddingHorizontal: 20,
      paddingTop: 20,
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
