import { StyleSheet } from "react-native"
import { router } from "expo-router"
import { Settings } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { Radii, withAlpha } from "@/constants"
import { PressableScale } from "@/components/motion"

/*
 * The way into Settings, from every tab.
 *
 * Settings is not in the tab bar — four labelled tabs plus the raised scan
 * action is all that fits before labels truncate. But a destination reachable
 * from exactly one screen is a destination nobody finds, so this sits in the
 * header of all four tabs in the same place.
 *
 * Tinted rather than a grey glyph on a grey surface: at 38pt a `textMuted` gear
 * in the corner reads as decoration. This is the only control on these headers
 * that leaves the tab set, so it is allowed to look like a button.
 * **/
export function SettingsButton() {
   const { colors } = useTheme()

   return (
      <PressableScale
         onPress={() => router.push("/(application)/(tabs)/settings")}
         accessibilityRole="button"
         accessibilityLabel="Settings"
         accessibilityHint="Your plan, preferences and account"
         hitSlop={8}
         style={StyleSheet.flatten([
            styles.button,
            {
               backgroundColor: colors.primarySoft,
               borderColor: withAlpha(colors.primary, 0.22),
            },
         ])}
      >
         <Settings size={19} color={colors.primary} strokeWidth={2.2} />
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   button: {
      width: 38,
      height: 38,
      borderRadius: Radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
      justifyContent: "center",
   },
})

export default SettingsButton
