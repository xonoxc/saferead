import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Crown, Check, Star, Users, Shield, Zap, LucideIcon } from "lucide-react-native"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { Fonts, FontSizes } from "@/constants/Fonts"
import { User } from "@/types"

export default function PremiumScreen() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const [features, plans] = getPlansAndFeatures(user)

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.crownContainer, { backgroundColor: colors.accent }]}>
          <Crown size={32} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Upgrade to Premium</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Unlock the full potential of legal document analysis
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={[styles.featureItem, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: `${colors.primary}20` }]}>
              <feature.icon size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.plansContainer}>
        <Text style={[styles.plansTitle, { color: colors.text }]}>Choose Your Plan</Text>
        {plans.map(plan => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              plan.popular && { borderColor: colors.primary, borderWidth: 2 },
              plan.current && { backgroundColor: `${colors.primary}10` },
            ]}
          >
            {plan.popular && (
              <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.popularText, { color: "#FFFFFF" }]}>Most Popular</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
              <View style={styles.planPricing}>
                <Text style={[styles.planPrice, { color: colors.text }]}>{plan.price}</Text>
                <Text style={[styles.planInterval, { color: colors.textSecondary }]}>
                  {plan.interval}
                </Text>
              </View>
            </View>

            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Check size={16} color={colors.success} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.planAction}>
              {plan.current ? (
                <Button
                  title="Current Plan"
                  variant="outline"
                  fullWidth
                  disabled
                  onPress={() => {}}
                />
              ) : (
                <Button
                  title={`Upgrade to ${plan.name}`}
                  variant={plan.popular ? "primary" : "outline"}
                  fullWidth
                  onPress={() => {
                    // Handle subscription upgrade
                  }}
                />
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Cancel anytime • 30-day money-back guarantee
        </Text>
      </View>
    </ScrollView>
  )
}

/*
 * feature and plan types
 * ***/
type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

type Plan = {
  id: string
  name: string
  price: string
  interval: string
  features: string[]
  limitations?: string[]
  popular?: boolean
  current?: boolean
}

/*
 * getPlansAndFeatures retrieves the available plans and features for the premium subscription.
 * **/
function getPlansAndFeatures(user: User | null): [Feature[], Plan[]] {
  const features: Feature[] = [
    {
      icon: Zap,
      title: "Advanced AI Analysis",
      description: "Get deeper insights with our enhanced AI models",
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Bank-level encryption and secure document storage",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate on documents with your team",
    },
    {
      icon: Star,
      title: "Priority Support",
      description: "24/7 premium support from our legal tech experts",
    },
  ]

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      interval: "forever",
      features: [
        "5 documents per month",
        "Basic AI analysis",
        "Text-to-speech",
        "Standard support",
      ],
      limitations: [
        "Limited document formats",
        "Basic risk assessment",
        "No collaboration features",
      ],
      current: user?.subscriptionTier === "free",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19.99",
      interval: "per month",
      features: [
        "Unlimited documents",
        "Advanced AI analysis",
        "All document formats",
        "Priority support",
        "Collaboration tools",
        "Advanced security",
        "Custom templates",
      ],
      popular: true,
      current: user?.subscriptionTier === "pro",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49.99",
      interval: "per month",
      features: [
        "Everything in Pro",
        "Team management",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
        "GDPR compliance",
        "Bulk processing",
        "API access",
      ],
      current: user?.subscriptionTier === "enterprise",
    },
  ]

  return [features, plans]
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 32,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 20,
  },
  featuresContainer: {
    padding: 20,
    paddingTop: 0,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  plansContainer: {
    padding: 20,
  },
  plansTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 24,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    left: 20,
    right: 20,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  popularText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  planName: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  planPricing: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  planPrice: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
  },
  planInterval: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
  },
  planFeatures: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    marginLeft: 8,
    flex: 1,
  },
  planAction: {
    marginTop: "auto",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
})
