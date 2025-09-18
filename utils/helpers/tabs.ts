import { Platform, type ViewStyle } from "react-native"

import type { ColorsType } from "@/hooks/useTheme"

export function getTabBarStyles(colors: ColorsType) {
   return Platform.select<ViewStyle>({
      ios: {
         position: "absolute",
      },
      default: {
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

         transitionDuration: "300ms",
         transitionProperty: "transform, opacity",
         transitionTimingFunction: "ease-in-out",
      },
   })
}
