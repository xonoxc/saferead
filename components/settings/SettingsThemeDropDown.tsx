import React from "react"
import { Sun, Moon, Smartphone } from "lucide-react-native"
import DropdownSelector from "../DropDownSelector"

import { useTheme, type ThemeMode } from "@/hooks/useTheme"

export default function SettingsThemeDropdown() {
   const { mode, setTheme, colors } = useTheme()
   return (
      <DropdownSelector
         label="THEME"
         selectorStyles={{ borderRadius: 18 }}
         selected={mode}
         options={[
            {
               value: "light",
               label: "Light",
               icon: <Sun size={20} color={colors.textSecondary} />,
            },
            { value: "dark", label: "Dark", icon: <Moon size={20} color={colors.textSecondary} /> },
            {
               value: "system",
               label: "System",
               icon: <Smartphone size={20} color={colors.textSecondary} />,
            },
         ]}
         onSelect={(val: ThemeMode) => setTheme(val)}
      />
   )
}
