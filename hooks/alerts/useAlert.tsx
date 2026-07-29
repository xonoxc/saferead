import { useEffect, useRef } from "react"
import { Pressable, StyleSheet } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { DrawerAlert } from "@/components/alert/DrawerAlert"
import { useAlertStore } from "@/store/useAlertStore"
import { useTheme } from "@/hooks/useTheme"

export const DrawerAlertRenderer = ({ children }: { children: React.ReactNode }) => {
   const { colors } = useTheme()
   const { alertOptions, hideAlert, suppress, hydrateSuppressed } = useAlertStore()

   /*
    * The checkbox is only *committed* when an action is pressed. Ticking it and
    * then backing out of the sheet must not silence the alert for good — that
    * would be a preference saved from an answer the user never gave.
    * **/
   const suppressRequested = useRef(false)
   const suppressKey = alertOptions?.suppressKey

   useEffect(() => {
      hydrateSuppressed()
   }, [hydrateSuppressed])

   useEffect(() => {
      suppressRequested.current = false
   }, [alertOptions])

   const dismiss = () => {
      suppressRequested.current = false
      hideAlert()
   }

   return (
      <>
         {children}

         {!!alertOptions && (
            <Animated.View
               entering={FadeIn.duration(150)}
               exiting={FadeOut.duration(150)}
               style={[StyleSheet.absoluteFill, styles.scrim, { backgroundColor: colors.overlay }]}
            >
               {/* Tapping outside cancels, which is the safe answer for a confirm. */}
               <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={dismiss}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss"
               />
            </Animated.View>
         )}

         {/*
          * Mounted per alert rather than kept alive and toggled, so the
          * "Don't ask me again" checkbox cannot arrive already ticked from the
          * alert before it.
          * **/}
         {!!alertOptions && (
            <DrawerAlert
               visible
               title={alertOptions.title}
               message={alertOptions.message}
               type={alertOptions.type}
               onSuppressChange={
                  suppressKey ? next => (suppressRequested.current = next) : undefined
               }
               actions={
                  alertOptions.actions?.map(action => ({
                     label: action.text,
                     variant: action.style,
                     onPress: () => {
                        if (suppressKey && suppressRequested.current) suppress(suppressKey)
                        hideAlert()
                        action.onPress?.()
                     },
                  })) ?? []
               }
            />
         )}
      </>
   )
}

const styles = StyleSheet.create({
   /* Below the Drawer's own zIndex of 1000, above everything else. */
   scrim: { zIndex: 999 },
})

export function useDrawerAlert() {
   return useAlertStore.getState().showAlert
}
