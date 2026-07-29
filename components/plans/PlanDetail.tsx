import { View, Text, StyleSheet } from "react-native"
import {
   BarChart3,
   BellRing,
   Brain,
   Check,
   CheckCheck,
   Code2,
   EyeOff,
   KeyRound,
   LayoutTemplate,
   LifeBuoy,
   Minus,
   Network,
   Plug,
   Sparkles,
   Users,
   Zap,
   type LucideIcon,
} from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useActiveLanguage } from "@/store/useLocaleStore"
import { Fonts, Radii, Spacing, Type, withAlpha } from "@/constants"
import { FadeInView } from "@/components/motion"
import { describeFeature, featureIsIncluded, isContactPlan, planMoneyParts } from "@/utils/helpers/plans"
import { formatMoneyCompact, billingSuffix } from "@/utils/helpers/money"

import type { Plan, PlanFeatureMeta, PlanFeatureSection } from "@/services/plans.service"

/*
 * Everything about one tier.
 *
 * This is the half of the screen the selector drives, and it is deliberately
 * generous: a pricing page's job is to answer "what do I actually get", and the
 * previous list-of-cards version answered it in six truncated bullets per tier.
 *
 * Three passes, narrowing as they go — the headline numbers you compare tiers
 * on, then the capabilities that switch on, then the full audit. All three are
 * built from the server's feature catalogue, so a facility added in the admin
 * lands in the right pass without a client release.
 * **/

/*
 * Icons for the capability rows.
 *
 * A lookup rather than a field on the catalogue: an icon is a client concern,
 * and putting lucide names in the Django admin would let someone type one that
 * does not exist and break the screen. Anything unmapped still renders, with
 * the generic mark.
 * **/
const FEATURE_ICONS: Record<string, LucideIcon> = {
   advanced_analysis: Brain,
   bulk_processing: Zap,
   priority_support: LifeBuoy,
   api_access: Code2,
   integrations: Plug,
   collaboration: Users,
   sso: KeyRound,
   obligation_graph: Network,
   renewal_alerts: BellRing,
   approval_workflow: CheckCheck,
   clause_benchmarks: BarChart3,
   custom_templates: LayoutTemplate,
   branding_removal: EyeOff,
}

interface PlanDetailProps {
   plan: Plan
   sections: PlanFeatureSection[]
}

export function PlanDetail({ plan, sections }: PlanDetailProps) {
   const { colors } = useTheme()
   const language = useActiveLanguage()

   const contact = isContactPlan(plan)
   const money = contact ? null : formatMoneyCompact(planMoneyParts(plan), language)

   const all = sections.flatMap(s => s.features)

   /* The numbers people compare tiers on. */
   const headlineLimits = all
      .filter(m => m.on_card && (m.kind === "limit" || m.kind === "number"))
      .map(m => ({ meta: m, text: describeFeature(m, plan.features[m.key]) }))
      .filter(row => row.text)
      .slice(0, 6)

   /*
    * The capabilities this tier switches on. Off-states belong in the audit
    * below, not here.
    *
    * Filtered through `featureIsIncluded` rather than `=== true` so polarity is
    * respected: "Ad-free" is a capability of the paid tiers even though the
    * underlying `ads_enabled` is false.
    * **/
   const capabilities = all
      .filter(m => m.kind === "flag" && featureIsIncluded(plan.features[m.key], m))
      .slice(0, 5)

   return (
      /*
       * Keyed on the plan so switching tiers re-mounts and fades rather than
       * swapping text in place — the animation is what makes the selector feel
       * connected to what it changes.
       * **/
      <View key={plan.id}>
         <FadeInView delay={0} style={styles.stack}>
            <View
               style={[
                  styles.hero,
                  {
                     backgroundColor: colors.primarySoft,
                     borderColor: withAlpha(colors.primary, 0.2),
                  },
               ]}
            >
               <View style={styles.heroTop}>
                  <View
                     style={[styles.heroIcon, { backgroundColor: withAlpha(colors.primary, 0.14) }]}
                  >
                     <Sparkles size={18} color={colors.primary} strokeWidth={2.2} />
                  </View>

                  {plan.is_featured && (
                     <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.badgeText, { color: colors.onPrimary }]}>
                           MOST POPULAR
                        </Text>
                     </View>
                  )}
               </View>

               <Text style={[styles.planName, { color: colors.text }]}>{plan.display_name}</Text>

               {contact ? (
                  <>
                     <Text style={[styles.customPrice, { color: colors.text }]}>
                        Custom pricing
                     </Text>
                     <Text style={[styles.priceNote, { color: colors.textMuted }]}>
                        Priced per organisation, agreed on a call
                     </Text>
                  </>
               ) : (
                  <>
                     <View style={styles.priceRow}>
                        <Text style={[styles.symbol, { color: colors.textSecondary }]}>
                           {money?.symbol}
                        </Text>
                        <Text style={[styles.amount, { color: colors.text }]}>{money?.value}</Text>
                        <Text style={[styles.cycle, { color: colors.textMuted }]}>
                           {billingSuffix(plan.billing_cycle)}
                        </Text>
                     </View>

                     {/*
                      * Only ever said about a converted figure — somebody
                      * comparing this to what their card is charged deserves to
                      * know which of the two they are reading.
                      * **/}
                     {plan.display_is_estimated && (
                        <Text style={[styles.priceNote, { color: colors.textMuted }]}>
                           approx. · billed in {plan.currency}
                        </Text>
                     )}
                  </>
               )}

               <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {plan.description}
               </Text>
            </View>
         </FadeInView>

         {headlineLimits.length > 0 && (
            <FadeInView delay={60} style={styles.stack}>
               <View style={styles.statGrid}>
                  {headlineLimits.map(({ meta, text }) => (
                     <View
                        key={meta.key}
                        style={[
                           styles.stat,
                           { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                     >
                        <Text style={[styles.statValue, { color: colors.text }]}>{text}</Text>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                           {meta.label}
                        </Text>
                     </View>
                  ))}
               </View>
            </FadeInView>
         )}

         {capabilities.length > 0 && (
            <FadeInView delay={120} style={styles.stack}>
               <Text style={[styles.sectionTitle, { color: colors.text }]}>What you get</Text>

               <View style={styles.capabilityList}>
                  {capabilities.map(meta => {
                     const Icon = FEATURE_ICONS[meta.key] ?? Sparkles
                     return (
                        <View key={meta.key} style={styles.capability}>
                           <View
                              style={[
                                 styles.capabilityIcon,
                                 { backgroundColor: withAlpha(colors.primary, 0.1) },
                              ]}
                           >
                              <Icon size={17} color={colors.primary} strokeWidth={2.2} />
                           </View>
                           <Text style={[styles.capabilityText, { color: colors.text }]}>
                              {describeFeature(meta, plan.features[meta.key]) ?? meta.label}
                           </Text>
                        </View>
                     )
                  })}
               </View>
            </FadeInView>
         )}

         <FadeInView delay={180} style={styles.stack}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Everything included</Text>

            <View style={styles.breakdown}>
               {sections.map(section => (
                  <SectionBlock key={section.key} section={section} plan={plan} />
               ))}
            </View>
         </FadeInView>
      </View>
   )
}

/* One catalogue section, ticked off against this plan. */
function SectionBlock({ section, plan }: { section: PlanFeatureSection; plan: Plan }) {
   const { colors } = useTheme()

   const rows = section.features
      .map((meta: PlanFeatureMeta) => ({ meta, text: describeFeature(meta, plan.features[meta.key]) }))
      .filter(row => row.text)

   if (rows.length === 0) return null

   return (
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
         <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            {section.label.toUpperCase()}
         </Text>

         {rows.map(({ meta, text }) => {
            const included = featureIsIncluded(plan.features[meta.key], meta)
            return (
               <View key={meta.key} style={styles.row}>
                  {included ? (
                     <Check size={14} color={colors.success} strokeWidth={2.6} />
                  ) : (
                     <Minus size={14} color={colors.textMuted} strokeWidth={2.6} />
                  )}
                  <Text
                     style={[
                        styles.rowText,
                        { color: included ? colors.textSecondary : colors.textMuted },
                     ]}
                  >
                     {text}
                  </Text>
               </View>
            )
         })}
      </View>
   )
}

const styles = StyleSheet.create({
   stack: { marginBottom: Spacing.md },
   hero: {
      borderRadius: Radii.lg,
      borderWidth: StyleSheet.hairlineWidth,
      padding: Spacing.lg,
      gap: 2,
   },
   heroTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: Spacing.xs,
   },
   heroIcon: {
      width: 38,
      height: 38,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   badge: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 4,
      borderRadius: Radii.xs,
   },
   badgeText: {
      ...Type.micro,
      fontFamily: Fonts.bold,
   },
   planName: {
      ...Type.heading,
      fontFamily: Fonts.semiBold,
   },
   priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 2,
   },
   symbol: {
      ...Type.heading,
      fontFamily: Fonts.semiBold,
   },
   amount: {
      ...Type.display,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   cycle: {
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   customPrice: {
      ...Type.display,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   priceNote: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   description: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      marginTop: Spacing.xs,
   },
   statGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.xs,
   },
   /*
    * Two per row on a narrow screen. `48%` rather than a computed width so the
    * grid survives the tablet layout without a Dimensions listener.
    * **/
   stat: {
      width: "48%",
      flexGrow: 1,
      borderRadius: Radii.sm,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      gap: 1,
   },
   statValue: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   statLabel: {
      ...Type.micro,
      fontFamily: Fonts.medium,
   },
   sectionTitle: {
      ...Type.subheading,
      fontFamily: Fonts.semiBold,
      marginBottom: Spacing.xs,
   },
   capabilityList: { gap: Spacing.xs },
   capability: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
   },
   capabilityIcon: {
      width: 34,
      height: 34,
      borderRadius: Radii.sm,
      alignItems: "center",
      justifyContent: "center",
   },
   capabilityText: {
      flex: 1,
      ...Type.bodySmall,
      fontFamily: Fonts.medium,
   },
   breakdown: { gap: Spacing.xs },
   section: {
      borderRadius: Radii.md,
      borderWidth: StyleSheet.hairlineWidth,
      padding: Spacing.sm,
      gap: 6,
   },
   sectionLabel: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
      marginBottom: 2,
   },
   row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.xs,
   },
   rowText: {
      flex: 1,
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
})

export default PlanDetail
