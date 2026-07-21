import { Platform, type ViewStyle } from "react-native"

import type { ColorsType } from "@/hooks/useTheme"

/*
 * CSS transitions only mean anything under react-native-web and are not part of
 * the ViewStyle contract, so they live behind the web branch and are cast at
 * that boundary rather than widening the return type for every platform.
 * **/
const webTransition = {
   transitionDuration: "300ms",
   transitionProperty: "transform, opacity",
   transitionTimingFunction: "ease-in-out",
} as unknown as ViewStyle

export function getTabBarStyles(colors: ColorsType) {
   const base: ViewStyle = {
      position: "absolute",
      flex: 1,
      bottom: 0,
      paddingTop: 16,
      alignItems: "center",
      height: 70,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderTopWidth: 0,
      shadowColor: colors.textMuted,
      zIndex: 1000,
   }

   return Platform.select<ViewStyle>({
      ios: {
         position: "absolute",
      },
      web: {
         ...base,
         ...webTransition,
      },
      default: base,
   })
}
