import { useEffect } from "react"
import { useTabStore } from "@/store/tab"

/**
 * Automatically hides the tab bar when the component mounts
 * and shows it again when it unmounts.
 */
export function useTabBarVisibilty(visible: boolean) {
  const setTabBarVisibility = useTabStore(s => s.setTabBarVisibility)

  useEffect(() => {
    setTabBarVisibility(visible)

    return () => {
      setTabBarVisibility(true)
    }
  }, [visible])
}
