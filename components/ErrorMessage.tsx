import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface ErrorMessageProps {
  message: string | undefined
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const { colors } = useTheme()

  if (!message) {
    return null
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.errorBackground }]}>
      <Text style={[styles.text, { color: colors.error }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
  },
})
