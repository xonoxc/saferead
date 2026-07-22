import { useFocusEffect } from "expo-router"

export function useScreenFocusCallback(callback: () => void, enabled: boolean = true) {
   useFocusEffect(() => {
      if (!enabled) return
      callback()
   })
}
