import { attempt } from "@/utils/attempt"
import { openBrowserAsync, warmUpAsync } from "expo-web-browser"
import { useDrawerAlert } from "../alerts/useAlert"

warmUpAsync()

export function useBrowserLink() {
   const showAlert = useDrawerAlert()

   return async function (fileLink?: string) {
      if (!fileLink) return

      const resp = await attempt(openBrowserAsync(fileLink))
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
