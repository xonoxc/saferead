import React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

interface LoadingSpinnerProps {
  size?: "small" | "large"
  color?: string
  message?: string
}

export const LoadingSpinner = ({ size = "large", color, message }: LoadingSpinnerProps) => {
  const { colors } = useTheme()
  const glow = useSharedValue(0)

  React.useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [glow])

  const animatedStyle = useAnimatedStyle(() => {
    const animatedColor = interpolateColor(glow.value, [0, 1], ["#000000", "#ffffff"])
    return {
      color: animatedColor,
    }
  })

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || colors.primary} />
      {message && <Animated.Text style={[styles.message, animatedStyle]}>{message}</Animated.Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
})
