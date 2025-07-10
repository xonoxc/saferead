import React, { useState } from "react"
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

interface TextInputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  error?: string
  multiline?: boolean
  numberOfLines?: number
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  autoCorrect?: boolean
  editable?: boolean
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  multiline,
  numberOfLines,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
  editable = true,
}) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)

  const inputStyle: StyleProp<TextStyle> = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
      color: colors.text,
    },
    multiline && { textAlignVertical: "top" },
    !editable && { opacity: 0.5 },
  ]

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <RNTextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  input: {
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    minHeight: 52,
  },
  error: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    marginTop: 6,
  },
})
