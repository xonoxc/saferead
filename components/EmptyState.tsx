import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import type { LucideIcon } from "lucide-react-native"
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

const { width: screenWidth } = Dimensions.get("window")

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionTitle?: string
  onAction?: () => void
  secondaryActionTitle?: string
  onSecondaryAction?: () => void
  showFloatingElements?: boolean
  variant?: "default" | "search" | "error"
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: IconComponent,
  title,
  description,
  actionTitle,
  onAction,
  secondaryActionTitle,
  onSecondaryAction,
  showFloatingElements = true,
  variant = "default",
}) => {
  const { colors } = useTheme()

  const iconScale = useSharedValue(1)
  const floatingY = useSharedValue(0)
  const pulseOpacity = useSharedValue(0.3)
  const sparkleScale = useSharedValue(0)

  React.useEffect(() => {
    // Icon breathing animation
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )

    // Floating animation
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )

    // Pulse animation
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )

    // Sparkle animation
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    )
  }, [])

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateY: floatingY.value }],
  }))

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }))

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
    opacity: interpolate(sparkleScale.value, [0, 1], [0, 1]),
  }))

  const getVariantColors = () => {
    switch (variant) {
      case "search":
        return {
          primary: colors.secondary,
          background: colors.secondary + "15",
        }
      case "error":
        return {
          primary: colors.error,
          background: colors.error + "15",
        }
      default:
        return {
          primary: colors.primary,
          background: colors.primary + "15",
        }
    }
  }

  const variantColors = getVariantColors()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating Background Elements */}
      {showFloatingElements && (
        <View style={styles.backgroundElements}>
          {[...Array(12)].map((_, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(index * 200).springify()}
              style={[
                styles.floatingElement,
                sparkleAnimatedStyle,
                {
                  backgroundColor: variantColors.primary + "20",
                  left: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
                  top: Math.random() * 400 + 100,
                  animationDelay: `${index * 300}ms`,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Main Content */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.content}>
        {/* Icon Container */}
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          {/* Pulse Circles */}
          <Animated.View
            style={[
              styles.pulseCircle,
              styles.pulseCircle1,
              { borderColor: variantColors.primary },
              pulseAnimatedStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.pulseCircle,
              styles.pulseCircle2,
              { borderColor: variantColors.primary },
              pulseAnimatedStyle,
            ]}
          />

          {/* Icon Wrapper */}
          <View style={[styles.iconWrapper, { backgroundColor: variantColors.background }]}>
            <IconComponent size={48} color={variantColors.primary} />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
        </Animated.View>

        {/* Action Buttons */}
        {(actionTitle || secondaryActionTitle) && (
          <Animated.View
            entering={FadeInDown.delay(700).springify()}
            style={styles.buttonContainer}
          >
            {actionTitle && onAction && (
              <Button
                title={actionTitle}
                onPress={onAction}
                variant="primary"
                size="large"
                fullWidth
              />
            )}

            {secondaryActionTitle && onSecondaryAction && (
              <AnimatedTouchableOpacity
                entering={FadeInDown.delay(800).springify()}
                style={styles.secondaryButton}
                onPress={onSecondaryAction}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                  {secondaryActionTitle}
                </Text>
              </AnimatedTouchableOpacity>
            )}
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
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
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
    width: 140,
    height: 140,
    top: -30,
    left: -30,
  },
  pulseCircle2: {
    width: 180,
    height: 180,
    top: -50,
    left: -50,
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
    marginBottom: 40,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 280,
    gap: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
  },
})
