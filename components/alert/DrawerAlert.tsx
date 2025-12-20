import React from "react"
import { Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics"
import { Drawer } from "@/components/Drawer"

import type { ColorsType } from "@/hooks/useTheme"

type DrawerAlertType = "default" | "info" | "success" | "error" | "roast"

export type ActionBtnVariant = "primary" | "secondary" | "destructive"

interface DrawerAlertAction {
   label: string
   onPress?: () => void
   variant?: ActionBtnVariant
}

interface DrawerAlertProps {
   visible: boolean
   type?: DrawerAlertType
   title?: string
   message?: string
   actions?: DrawerAlertAction[]
   onClose?: () => void
}

export function DrawerAlert({ visible, title, message, actions = [] }: DrawerAlertProps) {
   const { colors } = useTheme()

   return (
      <Drawer visible={visible} enableAbsolute position="bottom">
         <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16 }}>
            {title && (
               <Text style={[styles.title, { color: colors.text, marginBottom: 8 }]}>{title}</Text>
            )}
            {message && (
               <Text style={[styles.message, { color: colors.primary, marginBottom: 16 }]}>
                  {message}
               </Text>
            )}

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
               {actions.map((action, index) => (
                  <TouchableOpacity
                     key={index}
                     onPress={async () => {
                        await impactAsync(ImpactFeedbackStyle.Medium)
                        action.onPress?.()
                     }}
                     style={[
                        styles.actions,
                        {
                           backgroundColor: getVariantButtonColor(colors, action.variant),
                        },
                     ]}
                  >
                     <Text
                        style={[
                           styles.actionsText,
                           { color: getVariantButtonTextColor(colors, action.variant) },
                        ]}
                     >
                        {action.label}
                     </Text>
                  </TouchableOpacity>
               ))}
            </View>
         </View>
      </Drawer>
   )
}

function getVariantButtonTextColor(colors: ColorsType, variant: ActionBtnVariant = "primary") {
   switch (variant) {
      case "destructive":
         return colors.text
      default:
         return colors.background
   }
}

/*
 *
 * Utility function to get button color based on variant
 * **/
function getVariantButtonColor(colors: ColorsType, variant: ActionBtnVariant = "primary") {
   switch (variant) {
      case "primary":
         return colors.accent
      case "secondary":
         return colors.secondary
      case "destructive":
         return colors.error
      default:
         return colors.primary
   }
}

const styles = StyleSheet.create({
   title: {
      fontSize: FontSizes.lg,
      fontFamily: Fonts.bold,
   },
   message: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.medium,
   },
   actions: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
   },
   actionsText: {
      fontSize: FontSizes.xs,
      fontFamily: Fonts.bold,
   },
})
