import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants"

export function ProgressBar({ value }: { value: number }) {
  const { colors } = useTheme()

  return (
    <View style={barStyles.wrapper}>
      <Text style={[barStyles.label, { color: colors.text }]}>
        Confidence: {(value * 100).toFixed(0)}%
      </Text>
      <View style={[barStyles.container, { backgroundColor: colors.card }]}>
        <View
          style={[
            barStyles.filler,
            {
              width: `${value * 100}%`,
              backgroundColor: colors.vio,
            },
          ]}
        />
      </View>
    </View>
  )
}

export const barStyles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  label: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  container: {
    height: 6,
    borderRadius: 4,
    overflow: "hidden",
  },
  filler: {
    height: "100%",
    borderRadius: 4,
  },
})
