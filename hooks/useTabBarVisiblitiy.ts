import { useNavigation } from "expo-router"
import { useEffect } from "react"
import type { ColorsType } from "./useTheme"
import { getTabBarStyles } from "@/utils/helpers/tabs"

/*
 * @params visible - visible is when you want to show the tab bar
 * **/
export function useTabBarVisibility(visible: boolean, colors: ColorsType) {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        ...getTabBarStyles(colors),
        display: visible ? "flex" : "none",
      },
    })
  }, [visible])
}
