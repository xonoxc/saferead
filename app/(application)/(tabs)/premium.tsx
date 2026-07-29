import { View, Text, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"
import { PhoneCall } from "lucide-react-native"

import { useTheme } from "@/hooks/useTheme"
import usePremiumScreen from "@/hooks/screens/usePremiumScreen"
import { Button, CustomBackBtn } from "@/components"
import { FadeInView } from "@/components/motion"
import { PlanCard } from "@/components/plans/PlanCard"
import { ContactSalesForm } from "@/components/plans/ContactSalesForm"
import { PlansLoadingState } from "@/components/plans/PlansLoadingState"
import { Plansfallback } from "@/components/plans/PlansFallback"
import { Fonts, Spacing, Type, TAB_BAR_CLEARANCE } from "@/constants"
import { isContactPlan } from "@/utils/helpers/plans"

/*
 * Pricing.
 *
 * The previous version of this screen was hardcoded to a dark background with
 * white text, gold accents and a teal tick — none of them from the palette, and
 * unreadable in light mode, which is the default. It also hardcoded which
 * eleven features to list, so a tier's real limits and its advertised ones were
 * two separate sources of truth that could disagree.
 *
 * Both are server-owned now: the tiers come from `/plans/`, and what each one
 * advertises comes from `/plans/features/` — the same catalogue the Django
 * admin edits. Adding a limit is a server change, not a release.
 * **/
export default function PremiumScreen() {
   const { colors } = useTheme()

   const {
      plans,
      sections,
      isLoading,
      error,
      selectedPlan,
      selectPlan,
      isSelected,
      isCurrent,
      contactPlan,
      openContact,
      closeContact,
   } = usePremiumScreen()

   if (isLoading) return <PlansLoadingState />
   if (error || !plans.length) return <Plansfallback />

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={styles.header}>
            <CustomBackBtn onPress={() => router.back()} />
         </View>

         <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_CLEARANCE }]}
         >
            <FadeInView delay={80} style={styles.hero}>
               <Text style={[styles.eyebrow, { color: colors.textMuted }]}>PLANS</Text>
               <Text style={[styles.title, { color: colors.text }]}>
                  Know what you&apos;re signing
               </Text>
               <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Every tier reads the same contracts. What changes is how many, and how much of
                  the work SafeRead does for you.
               </Text>
            </FadeInView>

            <View style={styles.cards}>
               {plans.map((plan, index) => (
                  <FadeInView key={plan.id} index={index}>
                     <PlanCard
                        plan={plan}
                        sections={sections}
                        selected={isSelected(plan)}
                        isCurrent={isCurrent(plan)}
                        onPress={() => selectPlan(plan)}
                     />
                  </FadeInView>
               ))}
            </View>

            {selectedPlan && !isCurrent(selectedPlan) && selectedPlan.plan_type !== "free" && (
               <View style={styles.cta}>
                  {isContactPlan(selectedPlan) ? (
                     <>
                        <Button
                           title={`Contact sales about ${selectedPlan.display_name}`}
                           onPress={() => openContact(selectedPlan)}
                           fullWidth
                        />
                        <View style={styles.ctaNote}>
                           <PhoneCall size={13} color={colors.textMuted} strokeWidth={2.2} />
                           <Text style={[styles.ctaNoteText, { color: colors.textMuted }]}>
                              No card, no checkout. We agree a price with you on a call.
                           </Text>
                        </View>
                     </>
                  ) : (
                     <>
                        <Button
                           title={`Upgrade to ${selectedPlan.display_name}`}
                           onPress={() => {}}
                           fullWidth
                        />
                        <Text style={[styles.ctaNoteText, { color: colors.textMuted }]}>
                           Renews {selectedPlan.billing_cycle} until cancelled
                           {selectedPlan.display_is_estimated
                              ? ` · charged in ${selectedPlan.currency}`
                              : ""}
                           .
                        </Text>
                     </>
                  )}
               </View>
            )}
         </ScrollView>

         {contactPlan && <ContactSalesForm plan={contactPlan} onClose={closeContact} />}
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   header: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.xs,
   },
   scroll: { flex: 1 },
   content: {
      paddingHorizontal: Spacing.lg,
      gap: Spacing.md,
   },
   hero: { gap: 2 },
   eyebrow: {
      ...Type.overline,
      fontFamily: Fonts.semiBold,
   },
   title: {
      ...Type.title,
      fontFamily: Fonts.bold,
      includeFontPadding: false,
   },
   subtitle: {
      ...Type.bodySmall,
      fontFamily: Fonts.regular,
      marginTop: Spacing.xxs,
   },
   cards: { gap: Spacing.sm },
   cta: { gap: Spacing.xs, marginTop: Spacing.xs },
   ctaNote: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xxs,
   },
   ctaNoteText: {
      ...Type.caption,
      fontFamily: Fonts.regular,
      textAlign: "center",
   },
})
