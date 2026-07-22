import { BlurView } from "expo-blur"
import { StyleSheet } from "react-native"

import { useTheme } from "@/hooks/useTheme"

/*
 * A translucent chrome backdrop.
 *
 * The tint was pinned to the dark material, which showed as a dark smear on top
 * of the light theme. It now follows the active theme.
 * **/
export const BlurTabBarBackground = () => {
   const { isDark } = useTheme()

   return (
      <BlurView
         intensity={30}
         tint={isDark ? "systemChromeMaterialDark" : "systemChromeMaterialLight"}
         style={StyleSheet.absoluteFill}
      />
   )
}
