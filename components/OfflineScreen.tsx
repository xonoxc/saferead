import React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { WifiOff } from "lucide-react-native"
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

interface OfflineScreenProps {
  onRetry?: () => void
  showRetryButton?: boolean
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({
  onRetry,
  showRetryButton = true,
}) => {
  const { colors } = useTheme()

  const wifiIconScale = useSharedValue(1)
  const pulseOpacity = useSharedValue(0.3)
  const floatingY = useSharedValue(0)

  React.useEffect(() => {
    wifiIconScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )

    floatingY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )
  }, [floatingY, pulseOpacity, wifiIconScale])

  const wifiIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wifiIconScale.value }],
  }))

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }))

  const floatingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingY.value }],
  }))

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(index * 100).springify()}
            style={[
              styles.patternDot,
              {
                backgroundColor: colors.border,
                left: (index % 5) * (screenWidth / 5) + screenWidth / 10,
                top: Math.floor(index / 5) * (screenHeight / 8) + screenHeight / 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.content}>
        {/* Icon Container */}
        <Animated.View style={[styles.iconContainer, floatingAnimatedStyle]}>
          {/* Pulse Circles */}
          <Animated.View style={pulseAnimatedStyle}>
            <Animated.View
              style={[styles.pulseCircle, styles.pulseCircle1, { borderColor: colors.error }]}
            />
            <Animated.View
              style={[styles.pulseCircle, styles.pulseCircle2, { borderColor: colors.error }]}
            />
          </Animated.View>

          {/* WiFi Icon */}
          <Animated.View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.error + "15" },
              wifiIconAnimatedStyle,
            ]}
          >
            <WifiOff size={48} color={colors.error} />
          </Animated.View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>No Internet Connection</Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please check your connection and try again
          </Text>

          <Text style={[styles.description, { color: colors.textMuted }]}>
            Make sure WiFi or cellular data is turned on, then try again.
          </Text>
        </Animated.View>

        {/* Tips Section */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={[styles.tipsContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Quick fixes:</Text>

          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={[styles.tipBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Check your WiFi or mobile data
              </Text>
            </View>

            <View style={styles.tipItem}>
              <View style={[styles.tipBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Move to an area with better signal
              </Text>
            </View>

            <View style={styles.tipItem}>
              <View style={[styles.tipBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Restart your device if needed
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        {showRetryButton && (
          <Animated.View
            entering={FadeInDown.delay(900).springify()}
            style={styles.buttonContainer}
          >
            <Button title="Try Again" onPress={onRetry} variant="primary" size="large" fullWidth />
          </Animated.View>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    paddingTop: 100,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 40,
  },
  pulseCircle: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 100,
  },
  pulseCircle1: {
    width: 160,
    height: 160,
    top: -40,
    left: -40,
  },
  pulseCircle2: {
    width: 200,
    height: 200,
    top: -60,
    left: -60,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  tipsContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: "100%",
    maxWidth: 320,
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  tipText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 16,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  settingsText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
})
