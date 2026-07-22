import React from "react"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes, Radii } from "@/constants"
import { PressableScale } from "@/components/motion"

import { Text, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from "react-native"

interface ButtonProps {
   title: string
   onPress: (() => void) | undefined
   variant?: "primary" | "secondary" | "outline" | "ghost"
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
            baseStyle.push({ backgroundColor: colors.secondary })
            break
         case "outline":
            baseStyle.push({
               backgroundColor: "transparent",
               borderWidth: 2,
               borderColor: colors.primary,
            })
            break
         case "ghost":
            baseStyle.push({ backgroundColor: "transparent" })
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
            textColor = colors.background
            break
         case "outline":
            textColor = colors.primary
            break
         case "ghost":
            textColor = colors.primary
            break
      }

      return [styles.text, { color: textColor }]
   }

   const getLoadingColor = () => {
      switch (variant) {
         case "primary":
            return colors.onPrimary
         case "secondary":
            return colors.background
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
      borderRadius: Radii.md,
      alignItems: "center",
      justifyContent: "center",
   },
   small: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 36,
   },
   medium: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 48,
   },
   large: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      minHeight: 56,
   },
   fullWidth: {
      width: "100%",
   },
   text: {
      fontFamily: Fonts.semiBold,
      fontSize: FontSizes.md,
      textAlign: "center",
   },
})
