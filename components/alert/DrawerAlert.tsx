import React from "react"
import { Text, View, TouchableOpacity } from "react-native"
import { Drawer } from "../Drawer"
import { useTheme } from "@/hooks/useTheme"

type DrawerAlertType = "default" | "info" | "success" | "error" | "roast"

interface DrawerAlertAction {
  label: string
  onPress?: () => void
  variant?: "primary" | "secondary"
}

interface DrawerAlertProps {
  visible: boolean
  type?: DrawerAlertType
  title?: string
  message?: string
  actions?: DrawerAlertAction[]
  onClose?: () => void
}

export function DrawerAlert({
  visible,
  type = "default",
  title,
  message,
  actions = [],
}: DrawerAlertProps) {
  const { colors } = useTheme()

  const bg =
    type === "error"
      ? "#ffe5e5"
      : type === "success"
        ? "#e6ffe9"
        : type === "roast"
          ? "#fff0f6"
          : "#ffffff"

  return (
    <Drawer visible={visible}>
      <View style={{ backgroundColor: bg, borderRadius: 12, padding: 16 }}>
        {title && <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>{title}</Text>}
        {message && (
          <Text style={{ fontSize: 15, color: colors.text, marginBottom: 16 }}>{message}</Text>
        )}

        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={{
                backgroundColor: action.variant === "primary" ? colors.accent : colors.secondary,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: action.variant === "primary" ? colors.primary : colors.background,
                }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Drawer>
  )
}
