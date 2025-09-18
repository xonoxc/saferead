import { useFocusEffect } from "@react-navigation/native"

export function useScreenFocusCallback(callback: () => void, enabled: boolean = true) {
   useFocusEffect(() => {
      if (!enabled) return
      callback()
   })
}
