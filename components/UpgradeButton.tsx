import { useRouter } from "expo-router"
import { Star } from "lucide-react-native"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

const UpgradeButton = () => {
  const router = useRouter()
  const scale = useSharedValue(1)

  const handlePressIn = () => (scale.value = withSpring(0.94))

  const handlePressOut = () => {
    scale.value = withSpring(1)
    router.push("/premium")
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return (
    <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.9}>
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={["#FC466B", "#3F5EFB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Star color="white" size={18} />
          <Text style={[styles.text, { color: "white" }]}>Upgrade</Text>
          <Star color="white" size={18} />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
})

export default UpgradeButton
