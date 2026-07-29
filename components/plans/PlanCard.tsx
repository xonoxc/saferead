import { View, Text, StyleSheet } from "react-native"
import { Check, Minus } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import { useActiveLanguage } from "@/store/useLocaleStore"
import { Fonts, Radii, Spacing, Type, elevation, withAlpha } from "@/constants"
import { PressableScale } from "@/components/motion"
import {
   describeFeature,
   featureIsIncluded,
   isContactPlan,
   planHeadlinePrice,
} from "@/utils/helpers/plans"

import type { Plan, PlanFeatureSection } from "@/services/plans.service"

interface PlanCardProps {
   plan: Plan
   sections: PlanFeatureSection[]
   selected: boolean
   isCurrent: boolean
   onPress: () => void
}

/*
 * One tier.
 *
 * The summary lines are whichever catalogue entries are flagged `on_card` in
 * the Django admin — so what a tier advertises is a checkbox on the server, not
 * a list hardcoded here. The full breakdown appears only on the selected card:
 * thirty rows per tier, four tiers deep, is a spreadsheet, not a decision.
 * **/
export function PlanCard({ plan, sections, selected, isCurrent, onPress }: PlanCardProps) {
   const { colors } = useTheme()
   const language = useActiveLanguage()

   const contact = isContactPlan(plan)
   const cardFeatures = sections
      .flatMap(section => section.features)
      .filter(meta => meta.on_card)
      .map(meta => ({
         meta,
         text: describeFeature(meta, plan.features[meta.key]),
         included: featureIsIncluded(plan.features[meta.key]),
      }))
      .filter(row => row.text)

   return (
      <PressableScale
         onPress={onPress}
         accessibilityRole="button"
         accessibilityState={{ selected }}
         accessibilityLabel={`${plan.display_name}, ${planHeadlinePrice(plan, language)}`}
         style={StyleSheet.flatten([
            styles.card,
            {
               backgroundColor: colors.card,
               borderColor: selected ? colors.primary : colors.border,
               borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
            },
            elevation(colors, selected ? 2 : 1),
         ])}
      >
         <View style={styles.headerRow}>
            <View style={styles.identity}>
               <Text style={[styles.name, { color: colors.text }]}>{plan.display_name}</Text>
               <Text style={[styles.price, { color: selected ? colors.primary : colors.text }]}>
                  {planHeadlinePrice(plan, language)}
               </Text>

               {/*
                * Only ever said about a converted figure. Someone comparing
                * this against what their card is actually charged deserves to
                * know which of the two they are reading.
                * **/}
               {!contact && plan.display_is_estimated && (
                  <Text style={[styles.estimate, { color: colors.textMuted }]}>
                     approx. · billed in {plan.currency}
                  </Text>
               )}
            </View>

            <View style={styles.badges}>
               {isCurrent && (
                  <View style={[styles.badge, { backgroundColor: colors.successBackground }]}>
                     <Text style={[styles.badgeText, { color: colors.success }]}>CURRENT</Text>
                  </View>
               )}
               {plan.is_featured && !isCurrent && (
                  <View
                     style={[styles.badge, { backgroundColor: withAlpha(colors.primary, 0.12) }]}
                  >
                     <Text style={[styles.badgeText, { color: colors.primary }]}>POPULAR</Text>
                  </View>
               )}
            </View>
         </View>

         <Text style={[styles.description, { color: colors.textSecondary }]}>
            {plan.description}
         </Text>

         <View style={styles.features}>
            {cardFeatures.map(({ meta, text, included }) => (
               <View key={meta.key} style={styles.featureRow}>
                  {included ? (
                     <Check size={14} color={colors.success} strokeWidth={2.6} />
                  ) : (
                     <Minus size={14} color={colors.textMuted} strokeWidth={2.6} />
                  )}
                  <Text
                     style={[
                        styles.featureText,
                        { color: included ? colors.textSecondary : colors.textMuted },
                     ]}
                  >
                     {text}
                  </Text>
               </View>
            ))}
         </View>

         {selected && <FullBreakdown plan={plan} sections={sections} />}
      </PressableScale>
   )
}

/* Everything the tier includes, in the admin's own sections. */
function FullBreakdown({ plan, sections }: { plan: Plan; sections: PlanFeatureSection[] }) {
   const { colors } = useTheme()

   return (
      <View style={[styles.breakdown, { borderTopColor: colors.border }]}>
         {sections.map(section => {
            const rows = section.features
               .map(meta => ({ meta, text: describeFeature(meta, plan.features[meta.key]) }))
               .filter(row => row.text)

            if (rows.length === 0) return null

            return (
               <View key={section.key} style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                     {section.label.toUpperCase()}
                  </Text>

                  {rows.map(({ meta, text }) => (
                     <View key={meta.key} style={styles.featureRow}>
                        {featureIsIncluded(plan.features[meta.key]) ? (
                           <Check size={14} color={colors.success} strokeWidth={2.6} />
                        ) : (
                           <Minus size={14} color={colors.textMuted} strokeWidth={2.6} />
                        )}
                        <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                           {text}
                        </Text>
                     </View>
                  ))}
               </View>
            )
         })}
      </View>
   )
}

const styles = StyleSheet.create({
   card: {
      borderRadius: Radii.md,
      padding: Spacing.md,
      gap: Spacing.xs,
   },
   headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: Spacing.xs,
   },
   identity: { flex: 1, gap: 2 },
   name: {
      ...Type.bodySmall,
      fontFamily: Fonts.semiBold,
   },
   price: {
      ...Type.heading,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   estimate: {
      ...Type.micro,
      fontFamily: Fonts.regular,
   },
   badges: { gap: 4, alignItems: "flex-end" },
   badge: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 3,
      borderRadius: Radii.xs,
   },
   badgeText: {
      ...Type.micro,
      fontFamily: Fonts.bold,
   },
   description: {
      ...Type.caption,
      fontFamily: Fonts.regular,
   },
   features: { gap: 5, marginTop: Spacing.xxs },
   featureRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.xs,
   },
   featureText: {
      flex: 1,
      ...Type.caption,
      fontFamily: Fonts.medium,
   },
   breakdown: {
      marginTop: Spacing.xs,
      paddingTop: Spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      gap: Spacing.sm,
   },
   section: { gap: 5 },
   sectionLabel: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
})

export default PlanCard
