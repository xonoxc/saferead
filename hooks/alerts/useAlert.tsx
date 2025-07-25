import { DrawerAlert } from "@/components/alert/DrawerAlert"
import { createContext, ReactNode, use, useState } from "react"
import { AlertOptions as RNalertOptions } from "react-native"

export interface AlertAction {
  text: string
  onPress?: () => void
  style?: "default" | "cancel" | "destructive"
}

export interface AlertOptions extends RNalertOptions {
  title?: string
  message?: string
  type?: "default" | "info" | "success" | "error" | "roast"
  actions?: AlertAction[]
}

type ShowAlert = (options: AlertOptions) => void

const AlertContext = createContext<ShowAlert | undefined>(undefined)

export const DrawerAlertProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<AlertOptions | null>(null)

  const showAlert: ShowAlert = opts => {
    setOptions(opts)
  }

  const handleClose = () => {
    setOptions(null)
  }

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <DrawerAlert
        visible={!!options}
        title={options?.title}
        message={options?.message}
        type={options?.type}
        actions={
          options?.actions?.map(action => ({
            label: action.text,
            onPress: () => {
              handleClose()
              action.onPress?.()
            },
          })) ?? []
        }
      />
    </AlertContext.Provider>
  )
}

export const useDrawerAlert = (): ShowAlert => {
  const ctx = use(AlertContext)
  if (!ctx) {
    throw new Error("useDrawerAlert must be used inside a DrawerAlertProvider")
  }
  return ctx
}
