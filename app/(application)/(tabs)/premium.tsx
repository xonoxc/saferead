import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Check, Sparkles, Shield, Users, Zap, Brain } from "lucide-react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts } from "@/constants/Fonts"
import CustomBackBtn from "@/components/CustomBackBtn"

export default function PremiumScreen() {
  const { colors } = useTheme()
  const premiumFeatures = getPremiumFeatures()

  const proFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "Access to our most powerful legal AI models",
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Priority queue for instant document analysis",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate with unlimited team members",
    },
  ]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.header}>
        <CustomBackBtn containerWidth={45} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Sparkles size={32} color="#FFD700" />
          </View>

          <Text style={styles.title}>SafeRead Pro</Text>

          <Text style={styles.subtitle}>
            Access our most powerful AI models and advanced legal analysis features
          </Text>
        </Animated.View>

        {/* Key Features */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.keyFeaturesSection}
        >
          {proFeatures.map((feature, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(400 + index * 100).springify()}
              style={styles.keyFeatureItem}
            >
              <View style={styles.featureIconContainer}>
                <feature.icon size={20} color="#FFD700" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Features List */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.featuresSection}>
          {premiumFeatures.map((feature, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(700 + index * 50).springify()}
              style={styles.featureItem}
            >
              <View style={styles.checkContainer}>
                <Check size={20} color="#00D4AA" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Pricing Cards */}
        <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.pricingSection}>
          <View style={styles.pricingCards}>
            {/* Pro Plan */}
            <View style={[styles.pricingCard, styles.selectedCard]}>
              <Text style={styles.planName}>Pro</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>19.99</Text>
                <Text style={styles.period}>/mo</Text>
              </View>
            </View>

            {/* Enterprise Plan */}
            <View style={styles.pricingCard}>
              <Text style={styles.planName}>Enterprise</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>49.99</Text>
                <Text style={styles.period}>/mo</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View entering={FadeInDown.delay(1200).springify()} style={styles.ctaSection}>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
          </TouchableOpacity>

          <Text style={styles.billingInfo}>Auto-renews for $19.99/month until cancelled</Text>

          <TouchableOpacity style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restore subscription</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(1400).springify()} style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>|</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

function getPremiumFeatures() {
  return [
    "Everything in Free",
    "Unlimited document analysis with advanced AI models",
    "Priority processing and faster analysis",
    "Advanced risk assessment with detailed insights",
    "Collaboration tools and team sharing",
    "Premium templates and custom document types",
    "Priority customer support",
    "Advanced security and encryption",
    "Export capabilities and integrations",
    "Early access to new features",
  ]
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 25,
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
