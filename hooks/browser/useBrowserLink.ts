import { Platform } from "react-native"
import { attempt } from "@/utils/attempt"
import { openBrowserAsync, warmUpAsync } from "expo-web-browser"
import { useDrawerAlert } from "../alerts/useAlert"
import { useEffect } from "react"

/*
 * Warming the custom-tab service is an Android-only optimisation, and it used
 * to run at module scope. That made it fire the moment anything imported this
 * file - on web, where the method does not exist, that threw during import and
 * took the whole bundle down before the app could render.
 * **/
function useWarmBrowser() {
   useEffect(() => {
      if (Platform.OS !== "android") return

      void attempt(() => warmUpAsync())
   }, [])
}

export function useBrowserLink() {
   const showAlert = useDrawerAlert()

   useWarmBrowser()

   return async function (fileLink?: string) {
      if (!fileLink) return

      const resp = await attempt(() => openBrowserAsync(fileLink))
      if (!resp.ok) {
         showAlert({
            type: "error",
            title: "Error Opening Browser",
            message: "There was an error opening the file. Please try again later.",
            actions: [
               {
                  text: "OK",
                  style: "primary",
                  onPress: () => {},
               },
            ],
         })
         return
      }
   }
}
