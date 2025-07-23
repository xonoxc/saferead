import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { ServerCrash, MessageCircle, TriangleAlert as AlertTriangle } from "lucide-react-native"
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { router } from "expo-router"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

interface ServerErrorScreenProps {
  onRetry?: () => void
  onContactSupport?: () => void
  errorCode?: string
  errorMessage?: string
  showRetryButton?: boolean
  showSupportButton?: boolean
}

export default function ServerErrorScreen({
  onRetry,
  onContactSupport,
  errorCode = "500",
  errorMessage = "Something went wrong on our end",
  showRetryButton = true,
  showSupportButton = true,
}: ServerErrorScreenProps) {
  const { colors } = useTheme()

  const serverIconRotation = useSharedValue(0)
  const glitchOffset = useSharedValue(0)
  const sparkleScale = useSharedValue(0)
  const floatingY = useSharedValue(0)

  React.useEffect(() => {
    serverIconRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )

    glitchOffset.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 3000 }),
        withTiming(2, { duration: 100 }),
        withTiming(-2, { duration: 100 }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    )

    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    )

    floatingY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )
  }, [])

  const serverIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${serverIconRotation.value}deg` }, { translateX: glitchOffset.value }],
  }))

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
    opacity: interpolate(sparkleScale.value, [0, 1], [0, 1]),
  }))

  const floatingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingY.value }],
  }))

  function handleTryAgainPress() {
    if (onRetry) {
      onRetry()
      return
    }

    if (!router.canGoBack()) {
      router.replace("/")
      return
    }

    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        {[...Array(15)].map((_, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(index * 150).springify()}
            style={[
              styles.backgroundElement,
              sparkleAnimatedStyle,
              {
                backgroundColor: colors.warning + "20",
                left: Math.random() * screenWidth,
                top: Math.random() * screenHeight,
                animationDelay: `${index * 200}ms`,
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.content}>
        {/* Error Code Badge */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.errorBadge, { backgroundColor: colors.error + "15" }]}
        >
          <Text style={[styles.errorCode, { color: colors.error }]}>{errorCode}</Text>
        </Animated.View>

        {/* Icon Container */}
        <Animated.View style={[styles.iconContainer, floatingAnimatedStyle]}>
          {/* Warning Indicators */}
          <Animated.View
            style={[
              styles.warningIndicator,
              styles.warningIndicator1,
              { backgroundColor: colors.warning },
              sparkleAnimatedStyle,
            ]}
          >
            <AlertTriangle size={12} color="#FFFFFF" />
          </Animated.View>

          <Animated.View
            style={[
              styles.warningIndicator,
              styles.warningIndicator2,
              { backgroundColor: colors.error },
              sparkleAnimatedStyle,
            ]}
          >
            <AlertTriangle size={10} color="#FFFFFF" />
          </Animated.View>

          {/* Server Icon */}
          <Animated.View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.warning + "15" },
              serverIconAnimatedStyle,
            ]}
          >
            <ServerCrash size={48} color={colors.warning} />
          </Animated.View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Server Error</Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{errorMessage}</Text>

          <Text style={[styles.description, { color: colors.textMuted }]}>
            We're experiencing technical difficulties. Our team has been notified and is working to
            fix this issue.
          </Text>
        </Animated.View>

        {/* Status Info */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={[styles.statusContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.statusHeader}>
            <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.statusTitle, { color: colors.text }]}>System Status</Text>
          </View>

          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            We&apos;re working to restore normal service as quickly as possible. Please try again in a
            few minutes.
          </Text>

          <View style={styles.statusTime}>
            <Text style={[styles.statusTimeText, { color: colors.textMuted }]}>
              Estimated fix time: 5-10 minutes
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(900).springify()} style={styles.buttonContainer}>
          {showRetryButton && (
            <Button
              title="Try Again"
              onPress={handleTryAgainPress}
              variant="primary"
              size="large"
              fullWidth
            />
          )}

          {showSupportButton && (
            <TouchableOpacity style={styles.supportButton} onPress={onContactSupport}>
              <MessageCircle size={20} color={colors.textSecondary} />
              <Text style={[styles.supportText, { color: colors.textSecondary }]}>
                Contact Support
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Footer Info */}
        <Animated.View entering={FadeInDown.delay(1100).springify()} style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Error ID: {Date.now().toString(36).toUpperCase()}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundElement: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    paddingTop: 100,
  },
  errorBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  errorCode: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 40,
  },
  warningIndicator: {
    position: "absolute",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  warningIndicator1: {
    width: 24,
    height: 24,
    top: -12,
    right: -12,
  },
  warningIndicator2: {
    width: 20,
    height: 20,
    bottom: -10,
    left: -10,
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
    maxWidth: 300,
  },
  statusContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: "100%",
    maxWidth: 320,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    marginBottom: 12,
  },
  statusTime: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  statusTimeText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 16,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  supportText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  footerText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.mono,
    textAlign: "center",
  },
})
