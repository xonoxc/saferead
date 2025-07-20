import React from "react"
import { Sun, Moon, Smartphone } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { DropdownSelector } from "@/components/DropDownSelector"

export default function SettingsThemeDropdown() {
  const { mode, setTheme, colors } = useTheme()
  return (
    <DropdownSelector
      label="THEME"
      selected={mode}
      options={[
        { value: "light", label: "Light", icon: <Sun size={20} color={colors.textSecondary} /> },
        { value: "dark", label: "Dark", icon: <Moon size={20} color={colors.textSecondary} /> },
        {
          value: "system",
          label: "System",
          icon: <Smartphone size={20} color={colors.textSecondary} />,
        },
      ]}
      onSelect={val => setTheme(val)}
    />
  )
}
