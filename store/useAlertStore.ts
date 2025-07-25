import { create } from "zustand"
import { AlertOptions as RNalertOptions } from "react-native"

export interface AlertAction {
  text: string
  onPress?: () => void
  style?: "primary" | "secondary" | "destructive"
}

export interface AlertOptions extends RNalertOptions {
  title?: string
  message?: string
  type?: "default" | "info" | "success" | "error" | "roast"
  actions?: AlertAction[]
}

interface AlertState {
  alertOptions: AlertOptions | null
  showAlert: (options: AlertOptions) => void
  hideAlert: () => void
}

export const useAlertStore = create<AlertState>(set => ({
  alertOptions: null,
  showAlert: options => set({ alertOptions: options }),
  hideAlert: () => set({ alertOptions: null }),
}))
