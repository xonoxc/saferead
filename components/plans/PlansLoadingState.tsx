import { useTheme } from "@/hooks/useTheme"
import { View, StyleSheet } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"
import { CustomBackBtn } from "../CustomBackBtn"
import { LoadingSpinner } from "../LoadingSpinner"
import React from "react"
import { Fonts } from "@/constants"
import { router } from "expo-router"

export function PlansLoadingState() {
  const { colors } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.header}>
        <View style={{ width: "15%" }}>
          <CustomBackBtn onPress={() => router.push("/analyize")} />
        </View>
      </Animated.View>
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  keyFeaturesSection: {
    marginBottom: 40,
  },
  keyFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#CCCCCC",
    lineHeight: 20,
  },
  featuresSection: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 212, 170, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#FFFFFF",
    lineHeight: 24,
  },
  pricingSection: {
    marginBottom: 40,
  },
  pricingCards: {
    flexDirection: "row",
    gap: 16,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedCard: {
    borderColor: "#FFD700",
    backgroundColor: "rgba(255, 215, 0, 0.05)",
  },
  planName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: "#FFFFFF",
  },
  price: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
  },
  period: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#CCCCCC",
  },
  ctaSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  upgradeButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: "#000000",
  },
  billingInfo: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  restoreButton: {
    paddingVertical: 8,
  },
  restoreText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#FFFFFF",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLink: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#CCCCCC",
  },
  footerSeparator: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#CCCCCC",
    marginHorizontal: 12,
  },
})
