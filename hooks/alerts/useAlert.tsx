import { DrawerAlert } from "@/components/alert/DrawerAlert"
import { useAlertStore } from "@/store/useAlertStore"

export const DrawerAlertRenderer = ({ children }: { children: React.ReactNode }) => {
  const { alertOptions, hideAlert } = useAlertStore()

  return (
    <>
      {children}
      <DrawerAlert
        visible={!!alertOptions}
        title={alertOptions?.title}
        message={alertOptions?.message}
        type={alertOptions?.type}
        actions={
          alertOptions?.actions?.map(action => ({
            label: action.text,
            variant: action.style,
            onPress: () => {
              hideAlert()
              action.onPress?.()
            },
          })) ?? []
        }
      />
    </>
  )
}

export function useDrawerAlert() {
  return useAlertStore.getState().showAlert
}
