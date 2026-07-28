import React from "react"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, Radii, Type } from "@/constants"
import { PressableScale } from "@/components/motion"

import { Text, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from "react-native"

interface ButtonProps {
   title: string
   onPress: (() => void) | undefined
   variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
   size?: "small" | "medium" | "large"
   loading?: boolean
   disabled?: boolean
   fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
   title,
   onPress,
   variant = "primary",
   size = "medium",
   loading = false,
   disabled = false,
   fullWidth = false,
}) => {
   const { colors } = useTheme()

   const getButtonStyle = (): StyleProp<ViewStyle> => {
      const baseStyle: ViewStyle[] = [styles.button]

      switch (size) {
         case "small":
            baseStyle.push(styles.small)
            break
         case "large":
            baseStyle.push(styles.large)
            break
         default:
            baseStyle.push(styles.medium)
      }

      switch (variant) {
         case "primary":
            baseStyle.push({ backgroundColor: colors.primary })
            break
         case "secondary":
            /*
             * A filled neutral rather than near-black. Two solid dark buttons
             * side by side both read as "the main action"; a tinted surface
             * with a hairline border is unambiguously the lesser one.
             * **/
            baseStyle.push({
               backgroundColor: colors.surface,
               borderWidth: StyleSheet.hairlineWidth,
               borderColor: colors.border,
            })
            break
         case "outline":
            baseStyle.push({
               backgroundColor: "transparent",
               /*
                * 1px, not 2. A 2px ring is heavier than the filled button it
                * sits beside, which inverts the visual hierarchy it is meant
                * to express.
                * **/
               borderWidth: 1,
               borderColor: colors.borderStrong,
            })
            break
         case "ghost":
            baseStyle.push({ backgroundColor: "transparent" })
            break
         case "danger":
            /* Destructive actions - delete a contract, remove a seat. */
            baseStyle.push({ backgroundColor: colors.error })
            break
      }

      if (disabled || loading) {
         baseStyle.push({ opacity: 0.5 })
      }

      if (fullWidth) {
         baseStyle.push(styles.fullWidth)
      }

      /*
       * Flattened rather than returned as an array: expo-router's <Link asChild>
       * clones its child and rejects array styles, and the welcome screen wraps
       * this button in exactly that. Flattening here fixes every caller instead
       * of asking each one to remember.
       * **/
      return StyleSheet.flatten(baseStyle)
   }

   const getTextStyle = () => {
      let textColor = colors.text

      switch (variant) {
         /*
          * Filled variants need a colour guaranteed to contrast with the fill.
          * These used colors.background, which only happened to work while the
          * primary colour was pure black or white.
          * **/
         case "primary":
            textColor = colors.onPrimary
            break
         case "secondary":
            textColor = colors.text
            break
         case "outline":
            /*
             * Neutral text in a neutral ring. Colouring the label primary made
             * an outline button look like a third brand-coloured control on a
             * screen that already has one.
             * **/
            textColor = colors.text
            break
         case "ghost":
            textColor = colors.primary
            break
         case "danger":
            textColor = "#FFFFFF"
            break
      }

      return [styles.text, { color: textColor }]
   }

   const getLoadingColor = () => {
      switch (variant) {
         case "primary":
            return colors.onPrimary
         case "danger":
            return "#FFFFFF"
         case "secondary":
         case "outline":
            return colors.text
         default:
            return colors.primary
      }
   }

   return (
      <PressableScale
         style={getButtonStyle()}
         onPress={onPress}
         disabled={disabled || loading}
         accessibilityRole="button"
         accessibilityState={{ disabled: disabled || loading, busy: loading }}
      >
         {loading ? (
            <ActivityIndicator size="small" color={getLoadingColor()} />
         ) : (
            <Text style={getTextStyle()}>{title}</Text>
         )}
      </PressableScale>
   )
}

const styles = StyleSheet.create({
   button: {
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
   },
   small: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      minHeight: 36,
   },
   medium: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      minHeight: 46,
   },
   large: {
      paddingHorizontal: 24,
      paddingVertical: 15,
      minHeight: 52,
   },
   fullWidth: {
      width: "100%",
   },
   text: {
      fontFamily: Fonts.semiBold,
      ...Type.body,
      /*
       * Slightly tightened from the raw type token. Button labels are one or
       * two words on a single line, so the paragraph leading in Type.body just
       * pads the control vertically for no benefit.
       * **/
      lineHeight: 20,
      textAlign: "center",
   },
})
