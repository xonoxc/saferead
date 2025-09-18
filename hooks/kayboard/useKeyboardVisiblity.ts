import React from "react"
import { KeyboardEvents } from "react-native-keyboard-controller"

export function useKeyBoardVisibility(stateSetterFn: (visible: boolean) => void) {
   React.useEffect(() => {
      const showSub = KeyboardEvents.addListener("keyboardDidShow", () => {
         stateSetterFn(true)
      })

      const hideSub = KeyboardEvents.addListener("keyboardDidHide", () => {
         stateSetterFn(false)
      })

      return () => {
         showSub.remove()
         hideSub.remove()
      }
   }, [])
}
