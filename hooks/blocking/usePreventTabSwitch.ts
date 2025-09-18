import { useEffect } from "react"
import { BackHandler } from "react-native"
import { useDrawerAlert } from "../alerts/useAlert"

export function usePreventTabSwitch(
   block: boolean,
   okPressAction: () => void,
   alertMessage: string
) {
   const showBottomAlert = useDrawerAlert()

   useEffect(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
         showBottomAlert({
            title: "Warning",
            message: alertMessage,
            actions: [
               {
                  text: "Stay",
                  style: "secondary",
                  onPress: () => {},
               },
               {
                  text: "Leave",
                  style: "destructive",
                  onPress: () => okPressAction(),
               },
            ],
         })
         return block
      })

      return () => {
         backHandler.remove()
      }
   }, [])
}
