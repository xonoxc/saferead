import React from "react"
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

interface LineDividerProps {
  text?: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export const LineDivider: React.FC<LineDividerProps> = ({ text = "", style, textStyle }) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      {text !== "" && <Text style={[styles.text, { color: colors.text }, textStyle]}>{text}</Text>}
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
    opacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  text: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
})
