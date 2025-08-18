import React, { memo } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts, FontSizes } from "@/constants/Fonts"

const { width: screenWidth } = Dimensions.get("window")

interface OnboardingScreenProps {
  item: {
    title: string
    subtitle: string
    description: string
    icon: any
    demo?: React.ReactNode
    interactive?: React.ReactNode
  }
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = memo(({ item }) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.content, { width: screenWidth }]}>
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        style={[styles.iconContainer, { backgroundColor: colors.primaryFaded, shadowColor: colors.shadow }]}
      >
        <item.icon size={48} color={colors.primary} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
        <Text style={[styles.description, { color: colors.textTertiary }]}>{item.description}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.demoContainer}>
        {item.interactive || item.demo}
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    elevation: 8,
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  demoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
})
