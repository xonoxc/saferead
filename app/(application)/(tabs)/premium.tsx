import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Check, Sparkles, Shield, Zap, Brain } from "lucide-react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { useTheme } from "@/hooks/useTheme"
import { Fonts } from "@/constants/Fonts"
import { CustomBackBtn } from "@/components"
import { router } from "expo-router"
import { usePlans } from "@/hooks/queries/plans"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import type { Plan } from "@/services/plans.service"

export default function PremiumScreen() {
  const { colors } = useTheme()
  const { data: plansData, isLoading, error } = usePlans()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const plans = plansData?.results || []
  const premiumPlan = plans.find(plan => plan.plan_type === "premium")
  const freePlan = plans.find(plan => plan.plan_type === "free")

  // Set default selected plan to premium if available
  React.useEffect(() => {
    if (premiumPlan && !selectedPlan) {
      setSelectedPlan(premiumPlan)
    }
  }, [premiumPlan, selectedPlan])

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.header}>
          <View style={{ width: "15%" }}>
            <CustomBackBtn onPress={() => router.push("/analyize")} />
          </View>
        </Animated.View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading plans...</Text>
        </View>
      </View>
    )
  }

  if (error || !plans.length) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.header}>
          <View style={{ width: "15%" }}>
            <CustomBackBtn onPress={() => router.push("/analyize")} />
          </View>
        </Animated.View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Unable to load plans. Please try again later.
          </Text>
        </View>
      </View>
    )
  }

  const getFeatureDisplayText = (key: string, value: any): string => {
    switch (key) {
      case "storage_limit_gb":
        return `${value}GB Storage`
      case "retention_days":
        return `${value} Days Data Retention`
      case "documents_uploaded_limit":
        return typeof value === "string" && value === "unlimited" 
          ? "Unlimited Document Uploads" 
          : `${value} Document Uploads`
      case "analysis_generated_limit":
        return typeof value === "string" && value === "unlimited"
          ? "Unlimited AI Analysis"
          : `${value} AI Analysis`
      case "spaces_created_limit":
        return typeof value === "string" && value === "unlimited"
          ? "Unlimited Spaces"
          : `${value} Spaces`
      case "export_formats":
        return `Export to ${Array.isArray(value) ? value.join(", ").toUpperCase() : value}`
      case "priority_support":
        return value ? "Priority Customer Support" : "Standard Support"
      case "advanced_analysis":
        return value ? "Advanced AI Analysis" : "Basic Analysis"
      case "collaboration":
        return value ? "Team Collaboration" : "Individual Use Only"
      case "custom_templates":
        return value ? "Custom Templates" : "Standard Templates"
      case "branding_removal":
        return value ? "No Branding" : "SafeRead Branding"
      case "ads_enabled":
        return value ? "Ads Included" : "Ad-Free Experience"
      case "api_access":
        return value ? "API Access" : "No API Access"
      case "bulk_processing":
        return value ? "Bulk Document Processing" : "Single Document Processing"
      default:
        if (typeof value === "boolean") {
          return value ? key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : ""
        }
        return `${value} ${key.replace(/_/g, " ")}`
    }
  }

  const getKeyFeatures = (plan: Plan) => {
    const keyFeatureMap = {
      advanced_analysis: {
        icon: Brain,
        title: "Advanced AI Analysis",
        description: "Access to our most powerful legal AI models",
      },
      bulk_processing: {
        icon: Zap,
        title: "Lightning Fast Processing",
        description: "Priority queue for instant document analysis",
      },
      priority_support: {
        icon: Shield,
        title: "Priority Support",
        description: "Get help when you need it most",
      },
    }

    return Object.entries(keyFeatureMap)
      .filter(([key]) => plan.features[key as keyof typeof plan.features])
      .map(([, feature]) => feature)
  }

  const getDisplayFeatures = (plan: Plan) => {
    const importantFeatures = [
      "documents_uploaded_limit",
      "analysis_generated_limit",
      "storage_limit_gb",
      "spaces_created_limit",
      "export_formats",
      "advanced_analysis",
      "collaboration",
      "priority_support",
      "custom_templates",
      "branding_removal",
      "ads_enabled",
    ]

    return importantFeatures
      .map(key => {
        const value = plan.features[key as keyof typeof plan.features]
        const text = getFeatureDisplayText(key, value)
        return text ? text : null
      })
      .filter(Boolean) as string[]
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.header}>
        <View style={{ width: "15%" }}>
          <CustomBackBtn onPress={() => router.push("/analyize")} />
        </View>
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

          <Text style={styles.title}>
            {selectedPlan?.display_name || "SafeRead Pro"}
          </Text>

          <Text style={styles.subtitle}>
            {selectedPlan?.description || "Access our most powerful AI models and advanced legal analysis features"}
          </Text>
        </Animated.View>

        {/* Key Features */}
        {selectedPlan && (
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={styles.keyFeaturesSection}
          >
            {getKeyFeatures(selectedPlan).map((feature, index) => (
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
        )}

        {/* Features List */}
        {selectedPlan && (
          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.featuresSection}>
            {getDisplayFeatures(selectedPlan).map((feature, index) => (
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
        )}

        {/* Pricing Cards */}
        <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.pricingSection}>
          <View style={styles.pricingCards}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.pricingCard,
                  selectedPlan?.id === plan.id && styles.selectedCard
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <Text style={styles.planName}>{plan.display_name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.currency}>$</Text>
                  <Text style={styles.price}>{parseFloat(plan.price).toFixed(0)}</Text>
                  <Text style={styles.period}>
                    {plan.billing_cycle === "free" ? "" : `/${plan.billing_cycle.slice(0, 2)}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* CTA Button */}
        {selectedPlan && selectedPlan.plan_type !== "free" && (
          <Animated.View entering={FadeInDown.delay(1200).springify()} style={styles.ctaSection}>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>
                Upgrade to {selectedPlan.display_name}
              </Text>
            </TouchableOpacity>

            <Text style={styles.billingInfo}>
              Auto-renews for ${selectedPlan.price}/{selectedPlan.billing_cycle} until cancelled
            </Text>

            <TouchableOpacity style={styles.restoreButton}>
              <Text style={styles.restoreText}>Restore subscription</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

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
