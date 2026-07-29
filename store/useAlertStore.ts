import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { attempt } from "@/utils/attempt"

import type { AlertOptions as RNalertOptions } from "react-native"

export interface AlertAction {
   text: string
   onPress?: () => void
   style?: "primary" | "secondary" | "destructive" | "ghost"
}

export interface AlertOptions extends RNalertOptions {
   title?: string
   message?: string
   type?: "default" | "info" | "success" | "error" | "roast"
   actions?: AlertAction[]
   /*
    * Opt this alert into a "Don't ask me again" checkbox.
    *
    * The key identifies the *operation*, not the instance — every contract
    * deletion shares `delete-contract`, so answering once answers for all of
    * them. Alerts without a key can never be suppressed, which is the right
    * default: a one-off error message should not teach the app to stay quiet
    * about the next, different error.
    * **/
   suppressKey?: string
}

const STORAGE_KEY = "suppressed_alerts"

interface AlertState {
   alertOptions: AlertOptions | null
   suppressed: Record<string, boolean>
   showAlert: (options: AlertOptions) => void
   hideAlert: () => void
   suppress: (key: string) => void
   hydrateSuppressed: () => Promise<void>
}

export const useAlertStore = create<AlertState>((set, get) => ({
   alertOptions: null,
   suppressed: {},

   /*
    * A suppressed alert is not silently dropped — it is *answered*, by running
    * its last action.
    *
    * Last, because every call site in the app orders its actions the same way:
    * the escape hatch first (Cancel / Stay) and the thing the user came to do
    * last (Delete / Leave / OK). Dropping the alert without running anything
    * would turn "don't ask me again" into "silently refuse to delete", which is
    * the opposite of what the checkbox promises.
    * **/
   showAlert: options => {
      if (options.suppressKey && get().suppressed[options.suppressKey]) {
         const actions = options.actions ?? []
         actions[actions.length - 1]?.onPress?.()
         return
      }

      set({ alertOptions: options })
   },

   hideAlert: () => set({ alertOptions: null }),

   suppress: key => {
      const next = { ...get().suppressed, [key]: true }
      set({ suppressed: next })
      /* Fire and forget: the in-memory map is what the next alert reads. */
      attempt(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)))
   },

   hydrateSuppressed: async () => {
      const stored = await attempt(() => AsyncStorage.getItem(STORAGE_KEY))
      if (!stored.ok || !stored.data) return

      const parsed = await attempt(async () => JSON.parse(stored.data as string))
      if (parsed.ok && parsed.data && typeof parsed.data === "object") {
         set({ suppressed: parsed.data as Record<string, boolean> })
      }
   },
}))

/* Settings: give every "don't ask me again" back. */
export const resetSuppressedAlerts = async () => {
   useAlertStore.setState({ suppressed: {} })
   await attempt(() => AsyncStorage.removeItem(STORAGE_KEY))
}
