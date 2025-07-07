import React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface ButtonProps {
  title: string
  onPress: () => void
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
    const baseStyle = [styles.button] as { [key: string]: unknown }[]

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

    return baseStyle
  }

  const getTextStyle = () => {
    let textColor = colors.text

    switch (variant) {
      case "primary":
        textColor = colors.background
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
      case "secondary":
        return colors.background
      default:
        return colors.primary
    }
  }

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getLoadingColor()} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
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
