import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import {
  User,
  Moon,
  Sun,
  Globe,
  Volume2,
  Shield,
  Bell,
  CircleHelp as HelpCircle,
  LogOut,
  KeyRound,
} from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { router } from "expo-router"

export default function SettingsScreen() {
  const { colors, mode, setTheme } = useTheme()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ])
  }

  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          title: "Profile",
          value: `${user?.firstName} ${user?.lastName}`,
          onPress: () => {},
        },
        {
          icon: KeyRound,
          title: "Change Password",
          onPress: () => router.push("/(application)/change-password"),
        },
        {
          icon: Shield,
          title: "Privacy & Security",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: mode === "dark" ? Moon : Sun,
          title: "Theme",
          value: mode === "dark" ? "Dark" : "Light",
          onPress: () => setTheme(mode === "dark" ? "light" : "dark"),
        },
        {
          icon: Globe,
          title: "Language",
          value: "English",
          onPress: () => {},
        },
        {
          icon: Volume2,
          title: "Text-to-Speech",
          value: user?.preferences?.textToSpeech,
          type: "toggle",
          onPress: () => {},
        },
        {
          icon: Bell,
          title: "Notifications",
          value: user?.preferences?.notifications,
          type: "toggle",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          title: "Help & Support",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Account Actions",
      items: [
        {
          icon: LogOut,
          title: "Sign Out",
          onPress: handleLogout,
          danger: true,
        },
      ],
    },
  ]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={styles.content}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
            <View style={[styles.groupItems, { backgroundColor: colors.card }]}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.item,
                    itemIndex < group.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemLeft}>
                    <View style={[styles.itemIcon, { backgroundColor: colors.surface }]}>
                      <item.icon size={20} color={!!item ? colors.error : colors.textSecondary} />
                    </View>
                    <Text
                      style={[styles.itemTitle, { color: !!item ? colors.error : colors.text }]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.itemRight}>
                    {item.type === "toggle" ? (
                      <Switch
                        value={item.value}
                        onValueChange={() => {}}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={colors.background}
                      />
                    ) : (
                      item.value && (
                        <Text style={[styles.itemValue, { color: colors.textSecondary }]}>
                          {item.value}
                        </Text>
                      )
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>LegalAssist v1.0.0</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  group: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  groupItems: {
    borderRadius: 12,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemValue: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
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
